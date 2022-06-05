window.onload = function(){
    start();
}

async function start(){
    visu = new Visu(document.getElementById("content"));
    await visu.setMap("austria");
    visu.start();
}