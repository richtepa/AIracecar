longest = 0;
fastest = Infinity;

window.onload = function () {
    load();
}

async function load() {
    mapNames = ["bahrain", "spain", "australia", "italy_1", "austria"];
    mapCanvas = new MapCanvas(document.getElementById("mapDiv"));
    mapCoordinator = new MapCoordinator(mapNames, mapCanvas);
    await mapCoordinator.load();

    visu = new Visu(document.getElementById("contentDiv"));

    for (mapName of mapNames) {
        option = document.createElement("option");
        option.value = mapName;
        option.innerHTML = mapName;
        document.getElementById("mapInput").appendChild(option);
    }


    document.getElementById("mapInput").addEventListener("change", function () {
        visu.nextMap = this.value;
    });

    visu.load(document.getElementById("mapInput").value);

    //var bestJSON = await loadJson("best-austria.json");
    var bestJSON = await loadJson("best-combined.json");
    visu.nnCoordinator.nextNNs[1] = visu.nnCoordinator.createNNfromJSON(bestJSON);

    start();
}

function start() {
    running = true;
    //visu.drawingEnabled = true;

    loop = window.setInterval(function () {
        for (car of visu.cars) {
            car.frame();
        }
        visu.frame();
    }, 1000 / visu.fps);

    visu.clickPoint = false;
    console.log(JSON.stringify(visu.clickPoints));
    visu.clickPoints = new Array();

}

function startFast() {
    stop();
    
    running = true;
    visu.drawingEnabled = false;
    
    while(running && document.getElementById("keepRunning").checked){
        for (car of visu.cars) {
            car.frame();
        }
        visu.frame();
    }
}

function stop() {
    running = false;
    if (loop != undefined) {
        window.clearInterval(loop);
    }
    visu.clickPoints = new Array();
    visu.clickPoint = true;
}

function pause() {
    if (running) {
        stop();
    } else {
        start();
    }
}
