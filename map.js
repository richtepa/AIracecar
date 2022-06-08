class MapCoordinator {
    constructor(mapNames, mapCanvas) {
        this.mapNames = mapNames;
        this.mapCanvas = mapCanvas;
    }

    async load() {
        this.maps = new Object();
        for (var mapName of this.mapNames) {
            var map = new Map();
            await map.load(mapName);
            map.mapCanvas = this.mapCanvas;
            this.maps[mapName] = map;
        }
        this.reset();
    }
    
    reset(){
        this.mapNum = 0;
    }
    
    getMap(){
        return this.maps[this.mapNames[this.mapNum]];
    }
    
    nextMap(){
        this.mapNum ++;
        this.mapNum = this.mapNum % this.mapNames.length;
        return this.mapNum == 0;
    }
}


class Map {
    async load(name) {
        this.mapName = name;
        this.mapImage = await loadImage("maps/" + name + ".png");
        this.mapData = await loadJson("maps/" + name + ".json");
    }

    draw(scale) {
        this.scale = scale;
        this.mapCanvas.draw(scale, this.mapImage);
    }

    checkLine(from, to) {
        var dx = to.x - from.x;
        var dy = to.y - from.y;
        var d = Math.sqrt((dx * dx) + (dy * dy));
        if (d == 0) {
            return 1;
        }
        var s = 0;
        for (; s <= d; s++) {
            var checkx = from.x + (s / d * dx);
            var checky = from.y + (s / d * dy);
            if (!this.checkPixel(checkx, checky)) {
                return s / d;
            }
        }
        if (!this.checkPixel(to.x, to.y)) {
            return s / d
        }
        return 1;
    }

    checkPixel(x, y) {
        var pixel = this.mapCanvas.c.getImageData(Math.round(x * this.scale), Math.round(y * this.scale), 1, 1);
        return pixel.data[3] > 255 / 2;
    }
}

class MapCanvas {
    constructor(el) {
        this.height = window.innerHeight;
        this.width = window.innerWidth;
        this.el = el;
        var canvas = document.createElement("canvas");
        canvas.height = this.height;
        canvas.width = this.width;
        this.c = canvas.getContext("2d");
        this.el.appendChild(canvas);
    }

    draw(scale, mapImage) {
        this.c.clearRect(0, 0, this.width, this.height);
        this.c.drawImage(mapImage, 0, 0, mapImage.naturalWidth * scale, mapImage.naturalHeight * scale);
    }
}
