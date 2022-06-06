class NNcoordinator {
    constructor(nnStructure) {
        this.nnStructure = nnStructure;
        this.best = 10;
        this.pass = 10;
        this.rand = 45;
        this.bestNNs = new Array();
        this.generation = 0;
        this.createNNs();
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
    
    createNNfromJSON(json){
        return new NN(this.nnStructure, json, json);
    }

    evaluateNNs() {
        this.bestNNs = [...this.nextNNs];
        //this.bestNNs.sort((a, b) => (a.checkpoints > b.checkpoints) ? 1 : (a.checkpoints === b.checkpoints) ? ((a.sinceLastCheckpoint > b.sinceLastCheckpoint) ? 1 : -1) : -1);

        this.bestNNs.sort(function (a, b) {
            //more checkpoints
            if (a.checkpoints > b.checkpoints) {
                return -1;
            }
            if (a.checkpoints < b.checkpoints) {
                return 1;
            }

            
            // longer since checkpoints
            if (a.sinceLastCheckpoint > b.sinceLastCheckpoint) {
                return -1;
            }
            if (a.sinceLastCheckpoint > b.sinceLastCheckpoint) {
                return 1;
            }
            
            
            // shorter completion
            if (a.frameCounter < b.frameCounter) {
                return -1;
            }
        });

        //this.bestNNs = this.bestNNs.reverse();
        this.bestNNs = this.bestNNs.splice(0, this.best);
    }

    getNextNN() {
        this.nnNum++;
        if (this.nnNum > this.nextNNs.length - 1) {
            this.evaluateNNs();
            this.createNNs();
            this.nnNum++;
            longest = 0;
            fastest = Infinity;
            console.log("new generation");
        }
        return this.nextNNs[this.nnNum];
    }
}




class NN {
    constructor(netStruct, nn1 = undefined, nn2 = undefined) {
        this.reset();
        var net = [...netStruct];
        net.unshift(0); // [0, 9, 10, 10, 5, 2]
        this.net = new Array();
        for (var c = 1; c < net.length; c++) {
            var colNodes = new Array();
            for (var i = 0; i < net[c]; i++) {
                if (nn1 == undefined || nn2 == undefined) {
                    colNodes.push(new Node(net[c - 1]));
                } else {
                    colNodes.push(new Node(net[c - 1], nn1.net[c - 1][i], nn2.net[c - 1][i]));
                }
            }
            this.net.push(colNodes);
        }
    }
    
    reset(){
        this.checkpoints = 0;
        this.sinceLastCheckpoint = 0;
        this.frameCounter = 0;
    }
    
    export(){
        return JSON.stringify(this);
    }

    frame(inp) { // []


        for (var i = 0; i < inp.length; i++) {
            this.net[0][i].value = sigmoid(inp[i]);
        }

        this.calculate();

        var out = new Array();
        for (var i = 0; i < this.net[this.net.length - 1].length; i++) {
            out[i] = this.net[this.net.length - 1][i].value;
        }


        //var out = [0, 0];
        return out; // [acc, dir]
    }

    reward() {
        this.sinceLastCheckpoint = 0;
        this.checkpoints++;
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
    constructor(preNodeAmount, node1 = undefined, node2 = undefined) {
        this.value = 0
        this.weights = new Array();
        if (node1 == undefined || node2 == undefined) {
            for (var i = 0; i < preNodeAmount; i++) {
                this.weights.push(2 * Math.random() - 1); // weights zwischen -1 und 1
            }
            this.bias = 2 * Math.random() - 1; // bias zwischen -1 und 1
        } else {
            // TODO
            for (var i = 0; i < preNodeAmount; i++) {
                var gene1Weight = Math.random();
                var gene2Weight = 1 - gene1Weight;
                this.weights.push((node1.weights[i] * gene1Weight) + (node1.weights[i] * gene2Weight) + (Math.random() * 0.1) - 0.05);
            }
            var gene1Weight = Math.random();
            var gene2Weight = 1 - gene1Weight;
            this.bias = (node1.bias * gene1Weight) + (node1.bias * gene2Weight) + (Math.random() * 0.1) - 0.05;
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
