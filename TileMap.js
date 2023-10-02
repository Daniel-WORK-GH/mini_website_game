import { TEX_IDS, getTextureBounds, SHEET } from "./AssetHandler.js";
import { Camera } from "./Camera.js";
import { ICollision } from "./ICollision.js";
import { TextBox } from "./TextBox.js";
import { TextboxHandler } from "./TextboxHandler.js";
import { TileHandler } from "./TileHandler.js";
import { readTextFile } from "./Web.js";
export { TileMap }

const TESTING = false;

class TileMap{
    static{
        this.tilewidth = 16;
        this.tileheight = 16;

        this.entity = null;
        this.camera = new Camera();

        this.loaded = false;
        this.#loadmap();

        this.widthpx = 0;
        this.heightpx = 0;

        this.entities = [];
    }

    static setViewer(entity){
        this.entity = entity;
        this.camera.setLock(entity.camera.lock);
        this.camera.setZoom(entity.camera.scale);
        this.camera.update(entity.center)
    }

    static addEntity(entity){
        this.entities.push(entity);
    }

    static #loadmap(){
        readTextFile("./maps/map.txt").then(result => {
            let lines = result.split('\n');
            let dim = lines[0].split('x')

            this.map = [];
            this.mapwidth = parseInt(dim[0]);
            this.mapheight = parseInt(dim[1]);
            this.mapdepth = parseInt(dim[2]);
    
            let currentline = 1;
    
            for(let z = 0; z < this.mapdepth; z++){
                this.map.push([]);
                for(let y = 0; y < this.mapheight; y++){
                    this.map[z].push([]);   
                    let line = lines[currentline++].split(',');
    
                    for(let x = 0; x < this.mapwidth; x++){
                        let id = parseInt(line[x]);

                        if(id == TEX_IDS.MSG){
                            TextboxHandler.createAddTextbox(x,y,z);
                        }

                        this.map[z][y].push(TileHandler.getCreateTile(id, x, y, z));
                    }
                }
            }

            for(let i = this.mapdepth * this.mapheight + 1; i < lines.length - 1; i++){
                let data = lines[i].split(':');
                let cords = data[0].split(',');
                let x = parseInt(cords[0]);
                let y = parseInt(cords[1]);
                let z = parseInt(cords[2]);
                let txtbox = TextboxHandler.getTextboxAt(x, y, z);
                txtbox.setMsg(data[1]);
            }

            if(TESTING){
                console.log(`Loaded TileMap as ${this.map}`);
            }

            this.loaded = true;
        }).catch(err => {
            alert(err)
        });
    }

    static update(time){
        let entitycam = this.entity.getCamera();
        
        let entitypos = Array.from(entitycam.position);
        let position = this.camera.position;

        this.camera.setLock(this.entity.getCamera().lock)

        if(entitycam.scale != this.camera.scale){
            let diff = entitycam.scale - this.camera.scale;
            diff /= (time.millis);
            this.camera.setZoom(this.camera.scale + diff)
        }

        this.widthpx = this.mapwidth * this.camera.scale * this.tilewidth;
        this.heightpx = this.mapheight * this.camera.scale * this.tileheight;

        let speeddiffx = entitypos[0] - this.camera.position[0];
        let speeddiffy = entitypos[1] - this.camera.position[1];
        speeddiffx /= (time.millis / 6);
        speeddiffy /= (time.millis / 6);

        this.camera.update([
            position[0] + speeddiffx,
            position[1] + speeddiffy,
        ]);

        this.entities.forEach(e => {
            e.update(time);
            this.#handleCollisions(e);
        });

        for(let i = 0; i < this.entities.length; i++){
            for(let j = 0; j < this.entities.length; j++){
                if(i == j) continue;
                if(!this.entities[i].handleCollision) continue;
                this.entities[i].handleCollision(this.entities[j]);
            } 
        }
    }

    static #handleCollisions(entity){
        let x = entity.center[0];
        let y = entity.center[1];

        x /= this.tilewidth;
        y /= this.tileheight;
        x = Math.floor(x);
        y = Math.floor(y);

        let halfx = this.tilewidth / 2;
        let halfy = this.tileheight / 2;

        let centerx = entity.collisionBounds[0] + entity.collisionBounds[2] / 2;
        let centery = entity.collisionBounds[1] + entity.collisionBounds[3] / 2;

        let tiles = [
            this.map[1][y-1][x-1],
            this.map[1][y][x-1],
            this.map[1][y+1][x-1],
            this.map[1][y-1][x],
            this.map[1][y][x],
            this.map[1][y+1][x],
            this.map[1][y-1][x+1],
            this.map[1][y][x+1],
            this.map[1][y+1][x+1],
        ];

        for(let i = 0; i < tiles.length; i++){
            for(let j = i + 1; j < tiles.length; j++){
                if(tiles[i] == undefined || tiles[j] == undefined || !tiles[i].collisionBounds || !tiles[j].collisionBounds) continue;
                let ix = tiles[i].collisionBounds[0] + halfx;
                let iy = tiles[i].collisionBounds[1] + halfy;

                let jx = tiles[j].collisionBounds[0] + halfx;
                let jy = tiles[j].collisionBounds[1] + halfy;

                let idistance = (centerx - ix) ** 2 + (centery - iy) ** 2;
                let jdistance = (centerx - jx) ** 2 + (centery - jy) ** 2;

                if(jdistance < idistance){
                    let temp = tiles[j];
                    tiles[j] = tiles[i];
                    tiles[i] = temp;
                }
            }
        }

        let i = 0;
        tiles.forEach(t => {
            if(t != undefined){
                t.handleCollision(entity);
            }
        });
    }

    static checkIsOverlapingTile(bounds){
        let startx = bounds[0] / this.tilewidth;
        let starty = bounds[1] / this.tileheight;
        startx = Math.floor(startx)
        starty = Math.floor(starty)
        
        let endx = (bounds[0] + bounds[2]) / this.tilewidth;
        let endy = (bounds[1] + bounds[3]) / this.tileheight;
        endx = Math.ceil(endx)
        endy = Math.ceil(endy)

        for(let i = starty; i <= endy; i++){
            for(let j = startx; j <= endx; j++){
                for(let z = 0; z < this.mapdepth; z++){
                    if(!this.map[z][i][j].collisionBounds) continue;
                    if(ICollision.doOverlapRect(this.map[z][i][j].collisionBounds, bounds)){
                        return true;
                    }
                }
            }
        }
        return false;
    }

    static draw(context){
        if(!this.loaded) return;

        let camera = this.camera;

        let drawQueue = Array.from(this.entities);
        let drawn = Array(drawQueue.length).fill(false);
        
        for(let z = 0; z < this.mapdepth; z++){
            for(let y = 0; y < this.mapheight; y++){
                let i = 0;

                drawQueue.forEach(e => {
                    if(e.y + e.bounds[3] > y * this.tileheight && e.y + e.bounds[3] <= (y + 1) * this.tileheight && z > 0){
                        if(!drawn[i]){
                            e.draw(context,camera);
                            drawn[i] = true;
                        }
                    }
                    i++;
                });
                for(let x = 0; x < this.mapwidth; x++){
                    let tile = this.map[z][y][x];
                    if(tile.id == TEX_IDS.AIR) continue;

                    this.#drawTile(context, tile, camera);
                }
            }
        }
    }

    static #drawTile(context, tile, camera){
        let id = tile.id;
        let texbounds = getTextureBounds(id);
        let bounds = Array.from(tile.bounds);
        
        for(let i = 0; i < bounds.length; i++){
            bounds[i] *= camera.scale;
        }

        let reletivepos = camera.getRelativePosition([bounds[0], bounds[1]]);
        if(tile.layer != 0){
            let yoffset = -(texbounds[3] - this.tileheight) * camera.scale;
            reletivepos[1] += yoffset;
        }

        reletivepos[0] = Math.round(reletivepos[0])
        reletivepos[1] = Math.round(reletivepos[1])

        if(TESTING){
            console.log(`drawing ${id} from ${texbounds} to ${reletivepos[0]},${reletivepos[1]},${bounds[2]},${bounds[3]}`);
        }

        context.drawImage(SHEET,
            texbounds[0], texbounds[1], texbounds[2], texbounds[3], 
            reletivepos[0], reletivepos[1], bounds[2] , bounds[3]);
    }
}