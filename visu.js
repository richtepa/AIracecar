class Visu{
    constructor(el){
        this.height = window.innerHeight;
        this.width = window.innerWidth;
        
        var canvas = document.createElement("canvas");
        canvas.height = this.height;
        canvas.width = this.width;
        this.c = canvas.getContext("2d");
        el.appendChild(canvas);
    }
    
    async setMap(name){
        this.mapName = name;
        this.mapImage = await loadImage("maps/" + name + ".png");
    }
    
    start(){
        this.draw();
    }
    
    draw(){
        var scale1 = this.height / this.mapImage.naturalHeight;
        var scale2 = this.width / this.mapImage.naturalWidth;
        
        if(scale1 < scale2){
            this.scale = scale1;
        } else {
            this.scale = scale2;
        }
        
        this.c.drawImage(this.mapImage, 0, 0, this.mapImage.naturalWidth * this.scale, this.mapImage.naturalHeight * this.scale);
        console.log("draw");
    }
}