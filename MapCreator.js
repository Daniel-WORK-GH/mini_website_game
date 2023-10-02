import { SHEET, TEX_IDS, getTextureBounds } from "./AssetHandler.js";
import { Camera } from "./Camera.js";
import { downloadFile } from "./FileCreator.js";
import { Keys } from "./Keyboard.js";
import { MouseButtons, MousePosition } from "./Mouse.js";
import { getScreenDim } from "./Screen.js";
import { TextBox } from "./TextBox.js";
import { TextboxHandler } from "./TextboxHandler.js";
import { TileHandler } from "./TileHandler.js";
import { TileMap } from "./TileMap.js";
export { MapEditor }

const TESTING = false;

//HACK : WHOLE CLASS WRITTEN POORLY, FIX LATER

class MapEditor{
    static{
        this.maploaded = false;

        this.MENU_WIDTH = 2;

        this.mousex = 0;
        this.mousey = 0;
        this.layer = 0;

        this.tileid = 0;
        this.mouseBounds = [0, 0, 0, 0]
        this.menucreated = false;

        this.currenttxtbox = null;

        //to download only once per click
        this.lastP = false;
        
        this.lastright = false;
    }

    static setViewer(entity){
        TileMap.setViewer(entity);
        this.maploaded = true;
        this.#createMenu();
    }

    static #createMenu(){
        this.tiles = [];

        for (const [key, value] of Object.entries(TEX_IDS)) {
            if (getTextureBounds(value) === undefined) continue;
            this.tiles.push(value);
        }

        this.menucreated = true;
    }

    static update(time){   
        if(!this.maploaded) return;

        let screen = getScreenDim();

        let width = TileMap.camera.scale * TileMap.tilewidth;
        let height = TileMap.camera.scale * TileMap.tileheight;

        if(this.currenttxtbox != null){
            if(Keys.Enter){
                this.currenttxtbox.stopCreating();
                this.currenttxtbox = null;
            }
            return;
        }
        
        if(Keys.KeyP && !this.lastP) {
            this.downloadMap();
            this.lastP = true;
        }else {
            this.lastP = Keys.KeyP;
        }

        if(Keys.Digit1) this.layer = 0;
        else if(Keys.Digit2) this.layer = 1;
        
        if(MousePosition.X <= this.MENU_WIDTH * TileMap.tilewidth * TileMap.camera.scale){
            let x = MousePosition.X;
            let y = MousePosition.Y;

            this.mousex = Math.floor(x / width);
            this.mousey = Math.floor(y / height);

            this.setMouseMenuBounds(x, y, width, height);

            this.#onMenuClick();
        }else{
            let x = MousePosition.X + TileMap.camera.center[0] - screen[0] / 2;
            let y = MousePosition.Y + TileMap.camera.center[1] - screen[1] / 2;

            this.mousex = Math.floor(x / width);
            this.mousey = Math.floor(y / height);

            this.setMouseMapBounds(x, y, width, height);

            this.onMouseDown();
            this.onRightClick();
        }
    }

    static downloadMap(){
        let filename = "map.txt";
        let width = TileMap.mapwidth, height = TileMap.mapheight, depth = TileMap.mapdepth;

        let content = `${width}x${height}x${depth}\n`;
        
        for(let z = 0; z < depth; z++){
            for(let y = 0; y < height; y++){
                for(let x = 0; x < width; x++){
                    content += `${TileMap.map[z][y][x].id},`
                }
                content += '\n';
            }
        }

        TextboxHandler.textboxes.forEach(e => {
            content += `${e.x},${e.y},${e.z}:${e.msg}\n`
        });

        downloadFile(filename, content);
    }

    static onMouseDown(){
        if(!MouseButtons.LEFT) return;

        if(this.mousex >= TileMap.mapwidth || this.mousey >= TileMap.mapheight){
            this.resizeMapToFit();
        }

        let tile = TileMap.map[this.layer][this.mousey][this.mousex];
        if(tile.id == this.tileid) return;
        if(this.tileid == TEX_IDS.MSG){
            this.#createTextbox(this.mousex, this.mousey, this.layer);
        }

        TileHandler.setTile(tile, this.tileid)

        if(TESTING){
            console.log(`placed ${this.tileid} at ${this.mousex}, ${this.mousey}, 0`);
            console.log(TileMap.map);
        }
    }

    static onRightClick(){
        if(MouseButtons.RIGHT && !this.lastright) {
            this.lastP = true;
            let x = this.mousex, y = this.mousey, z = this.layer;

            this.currenttxtbox = TextboxHandler.getTextboxAt(x, y, z);
            this.currenttxtbox.startCreating();
        }else {
            this.lastright = MouseButtons.RIGHT;
        }
    }
    
    static #createTextbox(x, y, z){
        TextboxHandler.createAddTextbox(x, y, z);

        if(TESTING){
            this.currenttxtbox = TextboxHandler.getTextboxAt(x, y, z);
            console.log(`added textbox at : ${this.currenttxtbox.x} ${this.currenttxtbox.y} ${this.currenttxtbox.z}`)
            this.currenttxtbox = null;   
        }
    }

    static #onMenuClick(){
        if(!MouseButtons.LEFT) return;

        let index = this.mousey * this.MENU_WIDTH + this.mousex;

        if(index >= this.tiles.length){
            index = 0;
        } 

        this.tileid = this.tiles[index];
    }

    static resizeMapToFit(){
        if(this.mousex >= TileMap.mapwidth){
            TileMap.mapwidth = this.mousex + 1;
        }
        if(this.mousey >= TileMap.mapheight){
            TileMap.mapheight = this.mousey + 1;
        }

        this.#resizeMapHeight();
        this.#resizeMapWidth();
    }

    static #resizeMapWidth(){
        for (let z = 0; z < TileMap.mapdepth; z++) {
            for(let y = 0; y <= TileMap.mapheight; y++){
                for(let x = TileMap.map[z][y].length; x <= TileMap.mapwidth; x++){
                    TileMap.map[z][y].push(TileHandler.getCreateTile(0, x, y, z));
                }
            }
        }
    }

    static #resizeMapHeight(){
        for (let z = 0; z < TileMap.mapdepth; z++) {
            for(let y = TileMap.map[z].length; y <= TileMap.mapheight; y++){
                TileMap.map[z].push([]);
            }
        }
    }
    
    static setMouseMapBounds(x, y, width, height){
        x = Math.floor(x / width) * width;
        y = Math.floor(y / height) * height;

        let pos = TileMap.camera.getRelativePosition([x, y]);
        x = pos[0];
        y = pos[1];

        this.mouseBounds = [x, y, width, height];
    }

    static setMouseMenuBounds(x, y, width, height){
        x = Math.floor(x / width);
        y = Math.floor(y / height);

        let index = y * this.MENU_WIDTH + x;
        if(index >= this.tiles.length){
            index = 0;
        }

        this.mouseBounds = [x * width, y * height, width, height];
    }

    static #drawmenu(context){
        let width = TileMap.camera.scale * TileMap.tilewidth;
        let height = TileMap.camera.scale * TileMap.tileheight;

        for(let i = 0; i < this.tiles.length; i++){
            let id = this.tiles[i];
      
            let bounds = [
                (i % this.MENU_WIDTH) * width,
                (Math.floor(i / this.MENU_WIDTH)) * height,
                width,
                height
            ];

            let texbounds = getTextureBounds(id);

            context.drawImage(SHEET,
                texbounds[0], texbounds[1], texbounds[2], texbounds[3], 
                bounds[0], bounds[1], bounds[2], bounds[3]);    
        }
    }

    static draw(context){
        if(!this.maploaded) return;
        
        TileMap.draw(context); 

        if(this.menucreated){
            this.#drawmenu(context);
        }

        context.beginPath();
        context.lineWidth = "3";
        context.rect(this.mouseBounds[0],
            this.mouseBounds[1],
            this.mouseBounds[2], 
            this.mouseBounds[3]);
        context.stroke();

        context.beginPath();
        context.font = "32px ariel";
        context.fillText(`Current layer: ${this.layer}`,8 + this.MENU_WIDTH * TileMap.tilewidth * TileMap.camera.scale, 32);
        context.stroke();
    }
}