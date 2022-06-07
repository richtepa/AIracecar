class Car {
    constructor(nn) {
        this.nn = nn;
        this.accFactor = 1;
        this.dirFactor = 0.1;
        this.passDistance = 35;

        this.sensorDirections = [-Math.PI / 2, -Math.PI / 4, -Math.PI / 8, 0, Math.PI / 8, Math.PI / 4, Math.PI / 2];
        this.sensorReach = 250;

        this.distances = new Array(this.sensorDirections.length);
        this.frameCounter = 0;

        
        this.passed = 0;
        this.speed = 1;
        this.inp = {
            acc: 0,
            dir: 0
        };
        this.running = true;
    }
    
    reset(map){
        this.map = map;
        this.pos = { ...this.map.mapData.start
        };
        this.direction = direction(this.pos, this.map.mapData.checkpoints[0]);  
    }

    frame(firstFrame = false) {
        this.frameCounter++;
        this.nn.sinceLastCheckpoint++;
        this.nn.frameCounter++;
        if(this.speed == 0){
            this.nn.checkpoints = -2;
            this.lost();
        }
        if (this.nn.sinceLastCheckpoint > 15*60) {
            this.nn.checkpoints = -1;
            this.lost();
        }

        this.updatePosition();
        
        this.updateSensors();

        var information = [
            this.speed,
            this.direction,
            this.distances[0],
            this.distances[1],
            this.distances[2],
            this.distances[3],
            this.distances[4],
            this.distances[5],
            this.distances[6]
        ];
        var data = this.nn.frame(information);
        this.inp = {
            acc: data[0],
            dir: data[1]
        };

        this.speed += this.inp.acc * this.accFactor;
        if(this.speed < 0){
            this.speed = 0;
        }
        this.direction += this.inp.dir * this.dirFactor;

        if (this.passed == this.map.mapData.checkpoints.length && distance(this.pos, this.map.mapData.start) < this.passDistance) {
            this.done();
        }
    }

    updateSensors() {
        this.actualCheckpoint = this.checkCheckpoint(this.passed);
        for (var i = 0; i < this.sensorDirections.length; i++) {
            this.distances[i] = this.checkSensorLine(this.sensorDirections[i]);
        }
    }

    checkSensorLine(direction) {
        var dir = this.direction + direction;
        var dx = Math.cos(dir);
        var dy = Math.sin(dir);

        return this.map.checkLine(this.pos, {
            "x": this.pos.x + (dx * this.sensorReach),
            "y": this.pos.y + (dy * this.sensorReach)
        })
    }

    updatePosition() {
        var dx = Math.cos(this.direction) * this.speed;
        var dy = Math.sin(this.direction) * this.speed;
        var lost = this.map.checkLine(this.pos, {
            "x": this.pos.x + dx,
            "y": this.pos.y + dy
        });
        var factor = 1;
        if (lost < 1) {
            factor = lost;
            this.lost();
        }
        
        this.pos.x += dx * factor;
        this.pos.y += dy * factor;
    }

    checkCheckpoint(num) {
        var checkpoint = this.getCheckpoint(num);
        checkpoint.distance = distance(this.pos, checkpoint);
        checkpoint.direction = direction(this.pos, checkpoint);
        if (checkpoint.distance < this.passDistance) {
            if (!checkpoint.passed) {
                this.passed++;
                this.nn.reward();
            }
            checkpoint.passed = true;
        }
        return checkpoint;
    }

    getCheckpoint(num) {
        var n = num % this.map.mapData.checkpoints.length;
        if (num < 0) {
            n = this.map.mapData.checkpoints.length + n;
        }
        return this.map.mapData.checkpoints[n];
    }

    done() {
        this.nn.reward();
        
        longest = structuredClone(this.nn.checkpoints);
        var res = structuredClone(this.nn.frameCounter);
        if(res < fastest){
            fastest = res;
        }
        
        console.log(this.nn.frameCounter, "done");
        this.running = false;
    }

    lost() {
        var res = structuredClone(this.nn.checkpoints);
        if(res < 0){
            res = 0;
        }
        if(res > longest){
            longest = res;
        }
        
        console.log(res, "lost");
        this.running = false;
    }
}
