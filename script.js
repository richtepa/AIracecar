mapNames = ["austria", "italy_1"];
longest = 0;
fastest = Infinity;

window.onload = function () {
    load();
}

async function load() {
    visu = new Visu(document.getElementById("content"));

    maps = new Object();
    for (mapName of mapNames) {
        var map = new Map();
        await map.load(mapName, document.getElementById("map"));
        maps[mapName] = map;
    }

    visu.setMap(maps["italy_1"]);
    visu.load();

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
