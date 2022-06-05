class Visu {
    constructor(el) {
        this.fps = 30;

        this.height = window.innerHeight;
        this.width = window.innerWidth;

        var canvas = document.createElement("canvas");
        canvas.height = this.height;
        canvas.width = this.width;
        this.c = canvas.getContext("2d");
        el.appendChild(canvas);

        canvas.addEventListener("click", this.click);

    }

    click(event) {
        console.log(event.clientX / visu.scale, event.clientY / visu.scale);
    }

    async setMap(map) {
        this.map = map;
        this.drawMap();
    }

    load() {
        this.reset();
        this.frame();
    }

    reset() {
        console.log("reset");
        for (var corner of this.map.mapData.corners) {
            corner.passed = false;
        }
        this.cars = new Array();
        this.cars.push(new Car({
            map: this.map
        }));
    }

    frame() {
        this.c.clearRect(0, 0, this.width, this.height);
        this.drawStart();
        for (var corner of this.map.mapData.corners) {
            this.drawCorner(corner);
        }
        this.drawCar(this.cars[0]);
        this.drawHUD(this.cars[0]);
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

    drawCorner(corner) {
        this.drawBox(corner, corner.passed ? "green" : "red");
    }

    drawCar(car) {
        this.drawBox(car.pos, "blue");
        this.drawLine(car.pos, car.lastCorner, "green");
        this.drawLine(car.pos, car.actualCorner, "red");
        this.drawLine(car.pos, car.nextCorner, "gray");
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
