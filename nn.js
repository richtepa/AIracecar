class NNcoordinator {
    constructor(nnStructure, { best = 10, pass = 10, rand = 45 } = {}) {
        this.nnStructure = nnStructure;
        this.best = best;
        this.pass = pass;
        this.rand = rand;
        this.bestNNs = new Array();
        this.generation = 0;
    }

    createNNs() {
        this.generation++;
        if (this.bestNNs.length == 0) {
            this.nextNNs = new Array();
            for (var k = 0; k < this.best; k++) {
                this.nextNNs.push(new NN(this.nnStructure));
            }
            for (var i = 0; i < this.pass; i++) {
                for (var j = i + 1; j < this.pass; j++) {
                    this.nextNNs.push(new NN(this.nnStructure));
                }
            }
        } else {
            this.nextNNs = [...this.bestNNs];
            for (var k = 0; k < this.best; k++) {
                this.nextNNs[k].reset();
            }
            for (var i = 0; i < this.pass; i++) {
                for (var j = i + 1; j < this.pass; j++) {
                    this.nextNNs.push(new NN(this.nnStructure, this.bestNNs[i], this.bestNNs[j]));
                }
            }
        }
        for (var k = 0; k < this.rand; k++) {
            this.nextNNs.push(new NN(this.nnStructure));
        }
        this.nnNum = -1;
    }

    createNNfromObject(obj) {
        return new NN(this.nnStructure, obj, obj, 0);
    }

    evaluateNNs() {
        this.bestNNs = [...this.nextNNs];

        this.bestNNs.sort(function (a, b) {
            var length = Math.max(a.score.length, b.score.length);
            for (var i = 0; i < length; a++) {
                if (a == undefined || a.score == undefined || a.score[i] == undefined) {
                    return 1;
                }
                if (b == undefined || b.score == undefined || b.score[i] == undefined) {
                    return -1;
                }
                if (a.score[i] < b.score[i]) {
                    return 1;
                }
                if (a.score[i] > b.score[i]) {
                    return -1;
                }
            }
            return 1
        });

        this.bestNNs = this.bestNNs.splice(0, this.best);
    }

    getNextNN() {
        this.nnNum++;
        if (this.nextNNs == undefined) {
            this.createNNs();
            this.nnNum++;
            longest = 0;
            fastest = Infinity;
            console.log("new generation");
            this.isNewGeneration = true;
        } else if (this.nnNum > this.nextNNs.length - 1) {
            this.evaluateNNs();
            this.createNNs();
            this.nnNum++;
            longest = 0;
            fastest = Infinity;
            console.log("new generation");
            this.isNewGeneration = true;
        } else {
            this.isNewGeneration = false;
        }
        return this.nextNNs[this.nnNum];
    }
}




class NN {
    constructor(netStruct, nn1 = undefined, nn2 = undefined, bias = 0.1) {
        this.reset();
        var net = [...netStruct];
        net.unshift(0);
        this.net = new Array();
        for (var c = 1; c < net.length; c++) {
            var colNodes = new Array();
            for (var i = 0; i < net[c]; i++) {
                if (nn1 == undefined || nn2 == undefined) {
                    colNodes.push(new Node(net[c - 1], undefined, undefined, bias));
                } else {
                    colNodes.push(new Node(net[c - 1], nn1.net[c - 1][i], nn2.net[c - 1][i], 0));
                }
            }
            this.net.push(colNodes);
        }
    }

    reset() {
        this.score = [];
    }

    export () {
        return JSON.stringify(this);
    }

    frame(inp) {


        for (var i = 0; i < inp.length; i++) {
            this.net[0][i].value = sigmoid(inp[i]);
        }

        this.calculate();

        var out = new Array();
        for (var i = 0; i < this.net[this.net.length - 1].length; i++) {
            out[i] = this.net[this.net.length - 1][i].value;
        }

        return out;
    }

    calculate() {
        for (var c = 1; c < this.net.length; c++) {
            for (var n of this.net[c]) {
                n.calculate(this.net[c - 1]);
            }
        }
    }
}

class Node {
    constructor(preNodeAmount, node1 = undefined, node2 = undefined, bias = undefined) {
        this.value = 0
        this.weights = new Array();
        if (node1 == undefined || node2 == undefined) {
            for (var i = 0; i < preNodeAmount; i++) {
                this.weights.push(2 * Math.random() - 1); // weights between -1 and 1
            }
            this.bias = 2 * Math.random() - 1; // bias between -1 and 1
        } else {
            for (var i = 0; i < preNodeAmount; i++) {
                var gene1Weight = Math.random();
                var gene2Weight = 1 - gene1Weight;
                this.weights.push((node1.weights[i] * gene1Weight) + (node1.weights[i] * gene2Weight) + (Math.random() * bias) - (bias / 2));
            }
            var gene1Weight = Math.random();
            var gene2Weight = 1 - gene1Weight;
            this.bias = (node1.bias * gene1Weight) + (node1.bias * gene2Weight) + (Math.random() * bias) - (bias / 2);
        }
    }

    calculate(previousNodes) {
        var v = 0;
        for (var i = 0; i < previousNodes.length; i++) {
            v += previousNodes[i].value * this.weights[i]
        }
        v += this.bias;
        this.value = sigmoid(v);
    }
}
