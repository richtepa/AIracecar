window.onload = function () {
    load();
}

async function load() {
    nodeVisu = new NodeVisu(document.getElementById("contentDiv"));
    nn = await loadJson("../trainedNNs/best-combined.json")
    nodeVisu.loadNN(
        nn,
        [
            "speed",
            "direction",
            "distances[0]",
            "distances[1]",
            "distances[2]",
            "distances[3]",
            "distances[4]",
            "distances[5]",
            "distances[6]"
        ],
        [
            "acceleration",
            "direction"
        ]
    );
}

function update() {
    nodeVisu.drawNN();
}

async function loadJson(url) {
    var data = await fetch(url)
    var json = await data.json()
    return json;
}

class NodeVisu {

    constructor(el) {
        this.nodeRadius = 25;

        this.height = window.innerHeight;
        this.width = window.innerWidth;

        var canvas = document.createElement("canvas");
        canvas.height = this.height;
        canvas.width = this.width;
        this.c = canvas.getContext("2d");
        el.appendChild(canvas);

        var self = this;
        canvas.addEventListener("mousedown", this.highlight.bind(this));
        canvas.addEventListener("mouseup", this.show.bind(this));
    }

    loadNN(nn, inputs = [], outputs = []) {
        this.nn = nn;
        this.inputs = inputs;
        this.outputs = outputs;
        this.show();
    }

    highlight(e) {
        var x = Math.round((e.clientX / this.vx) - 0.5 - 1);
        var y = Math.round((e.clientY / this.vy) - 0.5);

        var px = (x + 0.5 + 1) * this.vx;
        var py = (y + 0.5) * this.vy;

        var dx = px - e.clientX;
        var dy = py - e.clientY;
        var d = Math.sqrt((dx * dx) + (dy * dy));

        if (d > this.nodeRadius) {
            return;
        }

        var minWeight = document.getElementById("weightRange").value

        for (var c = 0; c < this.nn.net.length; c++) {
            for (var r = 0; r < this.nn.net[c].length; r++) {
                this.nn.net[c][r].show = false;
            }
        }

        this.nn.net[x][y].show = true;
        for (var c = x; c > 0; c--) {
            for (var r = 0; r < this.nn.net[c].length; r++) {
                if (this.nn.net[c][r].show) {
                    for (var w = 0; w < this.nn.net[c][r].weights.length; w++) {
                        if (Math.abs(this.nn.net[c][r].weights[w]) > minWeight) {
                            this.nn.net[c - 1][w].show = true;
                        }
                    }
                }
            }
        }

        for (var c = x + 1; c < this.nn.net.length; c++) {
            for (var r = 0; r < this.nn.net[c].length; r++) {
                for (var w = 0; w < this.nn.net[c][r].weights.length; w++) {
                    if (Math.abs(this.nn.net[c][r].weights[w]) > minWeight) {
                        if (this.nn.net[c - 1][w].show) {
                            this.nn.net[c][r].show = true;
                        }
                    }
                }
            }
        }
        this.drawNN();
    }

    show() {
        for (var c = 0; c < this.nn.net.length; c++) {
            for (var r = 0; r < this.nn.net[c].length; r++) {
                this.nn.net[c][r].show = true;
            }
        }
        this.drawNN();
    }

    drawNN() {
        this.c.clearRect(0, 0, this.width, this.height);
        var columns = this.nn.net.length;
        var rows = 0;
        for (var col of this.nn.net) {
            if (col.length > rows) {
                rows = col.length;
            }
        }
        this.vx = this.width / (columns + 2);
        this.vy = this.height / rows;

        var minWeight = document.getElementById("weightRange").value

        for (var c = 0; c < this.nn.net.length; c++) {
            for (var r = 0; r < this.nn.net[c].length; r++) {
                if (this.nn.net[c][r].show) {
                    this.drawNode(c, r, this.nn.net[c][r].bias);
                    for (var w = 0; w < this.nn.net[c][r].weights.length; w++) {
                        if (Math.abs(this.nn.net[c][r].weights[w]) > minWeight && this.nn.net[c - 1][w].show) {
                            this.drawConnection(c, r, w, this.nn.net[c][r].weights[w]);
                        }
                    }
                }
            }
        }

        for (var i = 0; i < this.inputs.length; i++) {
            this.writeText(this.inputs[i], (0 + 0.5) * this.vx, (i + 0.5) * this.vy, 10);
        }
        for (var i = 0; i < this.outputs.length; i++) {
            this.writeText(this.outputs[i], (this.nn.net.length + 1 + 0.5) * this.vx, (i + 0.5) * this.vy, 10);
        }

        this.c.fillText(minWeight, 25, 50);
    }

    drawNode(x, y, bias) {
        var px = (x + 0.5 + 1) * this.vx;
        var py = (y + 0.5) * this.vy;

        var width = "1px";
        this.drawCircle(px, py, this.nodeRadius, "black", width);
    }

    drawConnection(toX, toY, fromY, weight) {
        var fx = ((toX - 1) + 0.5 + 1) * this.vx;
        var fy = (fromY + 0.5) * this.vy;
        var tx = (toX + 0.5 + 1) * this.vx;
        var ty = (toY + 0.5) * this.vy;

        var width = "1px";
        this.drawLine(fx, fy, tx, ty, this.getColor(weight), width);
    }

    drawCircle(x, y, r, color, width) {
        this.c.strokeStyle = color;
        this.c.beginPath();
        this.c.arc(x, y, r, 0, 2 * Math.PI);
        this.c.stroke();
    }

    drawLine(fromX, fromY, toX, toY, color, width) {
        this.c.strokeStyle = color;
        this.c.beginPath();
        this.c.moveTo(fromX, fromY);
        this.c.lineTo(toX, toY);
        this.c.stroke();
    }

    writeText(text, x, y, size) {
        this.c.fillStyle = "black";
        this.c.textBaseline = "middle";
        this.c.font = size + "px sans-serif";
        this.c.fillText(text, x, y);
    }

    getColor(value) {
        var r = 255;
        var g = 255;
        var b = 255;
        if (value < 0) {
            r = 255 - Math.round(-value * 255);
        }
        if (value > 0) {
            g = 255 - Math.round(value * 255);
        }
        return "rgb(" + [r, g, b].join(",") + ")";
    }
}
