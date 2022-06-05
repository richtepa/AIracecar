const loadImage = path => {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'Anonymous' // to avoid CORS if used with Canvas
        img.src = path
        img.onload = () => {
            resolve(img)
        }
        img.onerror = e => {
            reject(e)
        }
    })
}

async function loadJson(url) {
    var data = await fetch(url)
    var json = await data.json()
    return json;
}

function distance(from, to) {
    var dx = to.x - from.x;
    var dy = to.y - from.y;
    var d = Math.sqrt((dx * dx) + (dy * dy));
    return d;
}

function direction(from, to) {
    var dx = to.x - from.x;
    var dy = to.y - from.y;
    var rad = Math.atan2(dy, dx);
    return rad;
}
