localBest = 0;
globalBest = 0;

window.onload = function () {
    load();
}

async function load() {
    visu = new Visu(document.getElementById("content"));
    map = new Map();
    await map.load("austria", document.getElementById("map"));
    visu.setMap(map);
    visu.load();
    
    start();
}

function start() {
    running = true;
    loop = window.setInterval(function () {
        for(car of visu.cars){
            car.frame();
        }
        visu.frame();
    }, 1000 / visu.fps);
}

function stop() {
    window.clearInterval(loop);
    running = false;
}

function pause(){
    if(running){
        stop();
    } else {
        start();
    }
}