import { TEX_IDS, getTextureBounds, SHEET, getAnimation } from "./AssetHandler.js";
import { Camera } from "./Camera.js";
import { ICollision } from "./ICollision.js";
import { Keys } from "./Keyboard.js";
import { getScreenDim } from "./Screen.js";
import { Tile } from "./Tile.js";
import { TileMap } from "./TileMap.js";
import { Time } from "./Time.js";
export { Player }

const TESTING = false;

class Player {
    static SPEED = 1;
    static RUNMUL = 1.4;

    static DEFAULT_CAM_ZOOM = 6;

    constructor(){
        this.x = 80.13;
        this.y = 164.5;
        this.speed = [0, 0];
        this.camera = new Camera();
        this.camera.update([this.x, this.y])
        this.camera.setZoom(Player.DEFAULT_CAM_ZOOM);

        this.walkinganim = getAnimation(TEX_IDS.PLAYER_RUN);
        this.runninganim = getAnimation(TEX_IDS.PLAYER_RUN);
        this.standinganim = getAnimation(TEX_IDS.PLAYER_IDLE);
        this.runninganim.frametime /= Player.RUNMUL;
        this.fliped = false;

        this.vehicle = null;
        this.invehicle = false;

        this.currentanim = this.standinganim;

        this.bounds = [this.x, this.y, TileMap.tilewidth, TileMap.tileheight]
        this.center = [this.x + TileMap.tilewidth / 2, this.y + TileMap.tileheight / 2]

        this.collisionBounds = [
            this.x + TileMap.tilewidth * 0.1,
            this.y + TileMap.tileheight * 0.8,
            TileMap.tilewidth * 0.8,
            TileMap.tileheight * 0.2]

        this.prevE = false;
    }

    /**
     * @param {Time} time 
     */
    update(time){
        if(Keys.KeyE && !this.prevE){
            if(!this.invehicle){
                for(let i = 0; i < TileMap.entities.length; i++){
                    let e = TileMap.entities[i];

                    if(e.addPassenger){
                        let x = e.x + e.bounds[2] / 2;
                        let y = e.y + e.bounds[3] / 2;

                        if((x - this.center[0]) ** 2 + (y - this.center[1]) ** 2 < 650){
                            e.addPassenger(this);
                            this.vehicle = e;
                            this.invehicle = true;
                            this.prevE = true
                        }
                    }
                }
            }else{
                this.vehicle.removePassenger(this);
                this.vehicle = null;
                this.invehicle = false;
                this.prevE = true;
            }
        }else {
            this.prevE = Keys.KeyE;
        }

        if(!this.invehicle){
            this.#updateNormal(time)
        }else{
            this.#updateInVehicle(time);
        }
    }

    #updateNormal(time){
        this.x = this.collisionBounds[0] - TileMap.tilewidth * 0.1;
        this.y = this.collisionBounds[1] - TileMap.tileheight * 0.8;
        this.camera.update([this.x + this.bounds[2] / 2, this.y + this.bounds[3] / 2])

        this.speed = [0, 0];
        if(Keys.KeyW) this.speed[1] = -Player.SPEED; 
        if(Keys.KeyA) this.speed[0] = -Player.SPEED; 
        if(Keys.KeyS) this.speed[1] = Player.SPEED; 
        if(Keys.KeyD) this.speed[0] = Player.SPEED; 
        if(Keys.ShiftLeft){
            this.speed[0] *= Player.RUNMUL;
            this.speed[1] *= Player.RUNMUL;
            this.currentanim = this.runninganim;
        }else{
            this.currentanim = this.walkinganim;
        }

        if(this.speed[0] == 0 && this.speed[1] == 0){
            this.currentanim =  this.standinganim;
        }

        if(this.speed[0] > 0) this.fliped = false;
        if(this.speed[0] < 0) this.fliped = true;

        let dirclen = (this.speed[0] ** 2 + this.speed[1] ** 2) ** 0.5;
        if(dirclen != 0){
            let dircvec = [
                Math.abs(this.speed[0]) / dirclen,
                Math.abs(this.speed[1]) / dirclen]
            this.x += this.speed[0] * dircvec[0];
            this.y += this.speed[1] * dircvec[1];
        }
        
        this.currentanim.update(time);

        if(TESTING){
            console.log(`ending update, final position: ${this.x},${this.y}`);
            console.log(`walking animation status : ${this.walkinganim}`);
        }

        this.bounds[0] = this.x;
        this.bounds[1] = this.y;

        this.center = [this.x + TileMap.tilewidth / 2, this.y + TileMap.tileheight / 2];

        this.collisionBounds[0] = this.x + TileMap.tilewidth * 0.1;
        this.collisionBounds[1] = this.y + TileMap.tileheight * 0.8;
    }

    #updateInVehicle(time){
        let bounds = this.vehicle.collisionBounds;
        let aposx = bounds[0] + bounds[2] / 2 - this.collisionBounds[2] / 2;
        let aposy = bounds[1] + bounds[3];

        this.collisionBounds[0] = aposx;
        this.collisionBounds[1] = aposy;

        if(!TileMap.checkIsOverlapingTile(this.collisionBounds)) return;

        aposx = bounds[0] + bounds[2] / 2 - this.collisionBounds[2] / 2;
        aposy = bounds[1] - this.collisionBounds[3];

        this.collisionBounds[0] = aposx;
        this.collisionBounds[1] = aposy;
    }

    getCamera(){
        if(this.invehicle){
            return this.vehicle.camera;
        }
        return this.camera;
    }

    draw(context, camera = this.camera){
        if(this.invehicle) return;

        let bounds = this.currentanim.getBounds();
        let screen = getScreenDim();
        let pos = camera.getRelativePosition([this.x * camera.scale, this.y * camera.scale])
        let posx = pos[0];
        let posy = pos[1];
        let width = bounds[2] * camera.scale;
        let height = bounds[3] * camera.scale;

        if(TESTING){
            console.log(`drawing player from ${bounds} to ${screen[0]},${screen[1]},${this.width},${this.height}`);
        }

        if(this.fliped){
            context.save();
            context.scale(-1, 1);
            posx = width * -1 - posx;
        }

        posx = Math.round(posx);
        posy = Math.round(posy);

        context.drawImage(SHEET,
            bounds[0], bounds[1], bounds[2], bounds[3], 
            posx, posy, width, height);

        if(this.fliped){        
            context.restore();
        }
    }
}