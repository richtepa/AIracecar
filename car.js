class Car {
    constructor(cardata) {
        this.accFactor = 1;
        this.dirFactor = 1;
        this.passDistance = 40;

        this.frameCounter = 0;

        this.map = cardata.map;
        this.pos = { ...this.map.mapData.start
        };
        this.passed = 0;
        this.nn = new NN();
        this.frame(true);
        this.direction = this.actualCorner.direction;
        this.speed = 20;
    }

    frame(firstFrame = false) {
        this.frameCounter++;

        this.updateSensors();

        var information = [
            this.speed,
            this.direction,
            this.lastCorner.distance,
            this.lastCorner.direction - this.direction,
            this.actualCorner.distance,
            this.actualCorner.direction - this.direction,
            this.nextCorner.distance,
            this.nextCorner.direction - this.direction
        ];
        var data = this.nn.frame(information);
        this.inp = {
            acc: data[0],
            dir: data[1]
        };

        this.speed += this.inp.acc * this.accFactor;
        this.direction += this.inp.dir * this.dirFactor;

        if (!firstFrame) {
            this.updatePosition();
        }

        if (this.passed == this.map.mapData.corners.length && distance(this.pos, this.map.mapData.start) < this.passDistance) {
            this.done();
        }
    }

    updateSensors() {
        this.lastCorner = this.checkCorner(this.passed - 1);
        this.actualCorner = this.checkCorner(this.passed);
        this.nextCorner = this.checkCorner(this.passed + 1);
    }

    updatePosition() {
        var dx = Math.cos(this.direction) * this.speed;
        var dy = Math.sin(this.direction) * this.speed;
        var lost = this.map.checkLine(this.pos, {
            "x": this.pos.x + dx,
            "y": this.pos.y + dy
        });
        if(lost >= 0){
            //console.log("% lost", Math.round(lost*100));
            this.lost();
        }
        this.pos.x += dx;
        this.pos.y += dy;
    }

    checkCorner(num) {
        var corner = this.getCorner(num);
        corner.distance = distance(this.pos, corner);
        corner.direction = direction(this.pos, corner);
        if (corner.distance < this.passDistance) {
            if (!corner.passed) {
                this.passed++;
            }
            corner.passed = true;
        }
        return corner;
    }

    getCorner(num) {
        var n = num % this.map.mapData.corners.length;
        if (num < 0) {
            n = this.map.mapData.corners.length + n;
        }
        return this.map.mapData.corners[n];
    }

    done() {
        console.log("done");
        stop();
    }

    lost() {
        console.log("lost");
        stop();
    }
}
