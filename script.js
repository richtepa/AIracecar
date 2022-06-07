mapNames = ["austria", "italy_1"];
longest = 0;
fastest = Infinity;

window.onload = function () {
    load();
}

async function load() {
    visu = new Visu(document.getElementById("contentDiv"));

    mapCanvas = new MapCanvas(document.getElementById("mapDiv"));
    maps = new Object();
    for (mapName of mapNames) {
        var map = new Map();
        await map.load(mapName);
        map.mapCanvas = mapCanvas;
        maps[mapName] = map;
    }
    
    for (mapName of mapNames) {
        option = document.createElement("option");
        option.value = mapName;
        option.innerHTML = mapName;
        document.getElementById("mapInput").appendChild(option);
    }
    document.getElementById("mapInput").addEventListener("change", function(){
       visu.nextMap = this.value; 
    });
    
    visu.load(document.getElementById("mapInput").value);

    //var bestJSON = await loadJson("best-austria.json");
    var bestJSON = await loadJson("best-italy_1.json");
    visu.nnCoordinator.nextNNs[1] = visu.nnCoordinator.createNNfromJSON(bestJSON);
    
    start();
}

function start() {
    running = true;
    loop = window.setInterval(function () {
        for (car of visu.cars) {
            car.frame();
        }
        visu.frame();
    }, 1000 / visu.fps);

    visu.clickPoint = false;
    console.log(JSON.stringify(visu.clickPoints));
}

function stop() {
    window.clearInterval(loop);
    running = false;
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
