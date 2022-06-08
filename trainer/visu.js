class Visu {
    constructor(el) {
        this.fps = 60;
        this.nnCoordinator = new NNcoordinator([9, 10, 10, 5, 2]);

        this.showCheckpoints = false;

        this.height = window.innerHeight;
        this.width = window.innerWidth;

        var canvas = document.createElement("canvas");
        canvas.height = this.height;
        canvas.width = this.width;
        this.c = canvas.getContext("2d");
        el.appendChild(canvas);

        canvas.addEventListener("click", this.click);

        this.drawingEnabled = true;
    }

    click(event) {
        var x = Math.round(event.clientX / visu.scale);
        var y = Math.round(event.clientY / visu.scale);
        console.log(x, y);
        visu.clickPoints.push({
            "x": x,
            "y": y
        });
        visu.drawBox({
            "x": x,
            "y": y
        }, "yellow");
    }
    
    load(mapName) {
        if (mapName != undefined) {
            this.nextMap = mapName;
        }
        this.reset();
        this.frame();
    }

    reset() {
        this.cars = new Array();
        this.cars.push(new Car(this.nnCoordinator.getNextNN()));

        //if (this.nnCoordinator.isNewGeneration) {
            //this.map = mapCoordinator.maps[this.nextMap];
            this.map = mapCoordinator.getMap();
            this.map.draw(this.scale);
            this.drawMap(this.map);
        //}

        this.cars[0].load(this.map);
        this.cars[0].reset();

        for (var checkpoint of this.map.mapData.checkpoints) {
            checkpoint.passed = false;
        }
    }

    frame() {
        if (this.drawingEnabled) {
            this.c.clearRect(0, 0, this.width, this.height);
            this.drawStart();
            if (this.showCheckpoints) {
                for (var checkpoint of this.map.mapData.checkpoints) {
                    this.drawCheckpoint(checkpoint);
                }
            }
            this.drawCar(this.cars[0]);
            this.drawHUD(this.cars[0]);
        }

        if (!this.cars[0].running) {
            this.load();
        }
    }

    drawMap() {
        var scale1 = this.height / this.map.mapImage.naturalHeight;
        var scale2 = this.width / this.map.mapImage.naturalWidth;

        if (scale1 < scale2) {
            this.scale = scale1;
        } else {
            this.scale = scale2;
        }
        this.map.draw(this.scale);
    }

    drawStart() {
        this.drawBox(this.map.mapData.start.x, this.map.mapData.start.y, "white");

    }

    drawCheckpoint(checkpoint) {
        this.drawBox(checkpoint, checkpoint.passed ? "green" : "red");
    }

    drawCar(car) {
        this.drawBox(car.pos, "blue");
        
        for (var i = 0; i < car.distances.length; i++) {
            var to = new Object();
            var dir = car.direction - (car.inp.dir * car.dirFactor) + car.sensorDirections[i];
            var dx = Math.cos(dir);
            var dy = Math.sin(dir);

            this.drawLine(car.pos, {
                "x": car.pos.x + (car.distances[i] * dx * car.sensorReach),
                "y": car.pos.y + (car.distances[i] * dy * car.sensorReach)
            }, "red")
        }

    }

    drawHUD(car) {
        var border = 25;
        var size = 200;
        var width = 10;

        var left = border;
        var bottom = this.height - border;
        var right = left + size;
        var top = bottom - size;

        this.c.fillStyle = "gray";
        this.c.fillRect(left, top + ((size - width) / 2), size, width);
        this.c.fillRect(left + (size / 2) - (width / 2), top, width, size);

        this.c.fillStyle = "red";
        this.c.fillRect(left + (size / 2) + (car.inp.dir * size / 2) - (width / 2), top + (size / 2) + (-car.inp.acc * size / 2) - (width / 2), width, width);

        this.c.fillStyle = "black";
        this.c.textBaseline = "middle";
        this.c.font = size / 10 + "px sans-serif";
        this.c.fillText(car.frameCounter, left + size + border, top + (size / 2));

        this.c.fillText(this.nnCoordinator.generation + "(" + this.nnCoordinator.nnNum + "/" + this.nnCoordinator.nextNNs.length + ")", border, (2 * border) + width);

        if (fastest == Infinity) {
            this.c.fillText(longest, border, (2 * border) + (3 * width));
        } else {
            this.c.fillText(fastest, border, (2 * border) + (3 * width));
        }

    }

    drawLine(from, to, color) {
        this.c.strokeStyle = color;
        this.c.beginPath();
        this.c.moveTo(from.x * this.scale, from.y * this.scale);
        this.c.lineTo(to.x * this.scale, to.y * this.scale);
        this.c.stroke();
    }

    drawBox(pos, color) {
        var size = 10;
        this.c.fillStyle = color;
        this.c.fillRect((pos.x - (size / 2)) * this.scale, (pos.y - (size / 2)) * this.scale, size * this.scale, size * this.scale);
    }
}
