window.onload = function () {
    load();
}

async function load() {
    visu = new Visu(document.getElementById("content"));
    map = new Map();
    await map.load("austria");
    visu.setMap(map);
    visu.load();
    
    start();
}

function start() {
    loop = window.setInterval(function () {
        for(car of visu.cars){
            car.frame();
        }
        visu.frame();
    }, 1000 / visu.fps);
}

function stop() {
    window.clearInterval(loop);
}
