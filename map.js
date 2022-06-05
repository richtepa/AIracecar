class Map {
    async load(name) {
        this.mapName = name;
        this.mapImage = await loadImage("maps/" + name + ".png");
        this.mapData = await loadJson("maps/" + name + ".json");
    }
}
