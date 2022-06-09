# AIracecar

Creating a neural network from scratch.

Optimization of the neurons is done by reproduction / survival of the fittest.

```javascript

var structure = [4, 5, 5, 2] // nodes per layer [input, hiddenLayer1, hiddenLayer2, output]
var options = {best: 10, pass: 10, rand: 45} // optional, how much {best: <reproduce each with each>, pass: <keep to next gen>, rand: <additional random>}
var nnCoordinator = new NNcoordinator(structure, options);

// training of empty NN
while(training){
    var nn = nnCoordinator.getNextNN(); // getNN
    if(nnCoordinator.isNewGeneration){
        console.log("new generation");
    }
    while(simulating){
        // ToDo: calculate inputs, array of numbers - each normalized: -1 to 1
        var inputs = [speed, distanceLeft, distanceCenter, distanceRight];
        var outputs = nn.frame(inputs); // output = array of values - each normalized: -1 to 1
        var acceleration = outputs[0];
        var direction = outputs[1];
        // ToDo: check result
    }
    nn.score = [mapsDone, checkpointsDone, timeNeeded]; // set score of NN (most important to least important property)
}

// export best NN
var json = nnCoordinator.bestNNs[0].export(); //.bestNNs are the best of the last fully tested gen

// load trained NN
var bestNN = JSON.parse(json); // use json of NN generated from export
visu.nnCoordinator.nextNNs[1] = visu.nnCoordinator.createNNfromObject(bestNN); // load NN to position 2 of the next NNs (obviously before simulation of this position)

```

## Training

Demo of the training environment:
https://richtepa.github.io/AIracecar/trainer/index.html

UI is only basic, WIP:
* Generation, #NN, amount of NNs in generation and most checkpoints or fastest time (top left corner)
* Acceleration and direction (bottom left corner)
* Play/Pause (red square, bottom right corner)

https://user-images.githubusercontent.com/32306396/172198989-222c11df-98e3-40b0-a812-4d801824798e.mp4


## Node Inspector

Demo of the node inspector:
https://richtepa.github.io/AIracecar/inspector/index.html

UI is only basic, WIP:
* Use slider to eliminate connections with a lower absolute weight
* Click and hold module to filter for connected nodes to the selected one
