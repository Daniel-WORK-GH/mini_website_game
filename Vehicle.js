import { SHEET, TEX_IDS, getAnimation } from "./AssetHandler.js";
import { Camera } from "./Camera.js";
import { ICollision } from "./ICollision.js";
import { Keys } from "./Keyboard.js";
import { getScreenDim } from "./Screen.js";
import { TileMap } from "./TileMap.js";
export {Vehicle}

class Vehicle{    
    static DEFAULT_CAM_ZOOM = 6;
    static SPEED = 2.2;

    constructor(){
        this.x = 110;
        this.y = 310;

        this.camera = new Camera();
        this.camera.setLock(true);
        this.camera.setZoom(Vehicle.DEFAULT_CAM_ZOOM);

        this.idleanim = getAnimation(TEX_IDS.ROVER_IDLE);   
        this.drivinganim = getAnimation(TEX_IDS.ROVER_DRIVE);
        this.currentanim = this.idleanim;
        this.fliped = false;

        this.bounds = [this.x, this.y, 32, 32]
        this.speed = [0, 0]
        this.center = [this.x + 32 / 2, this.y + 32 / 2]

        this.collisionBounds = [this.x, this.y + 11, 32, 18];

        this.haspassenger = false;
    }

    addPassenger(entity){
        if(!this.haspassenger){
            this.currentanim = this.drivinganim;
            this.haspassenger = true;

            this.camera.position = entity.camera.position;
        }
    }

    removePassenger(entity){
        if(this.haspassenger){
            this.currentanim = this.idleanim;
            this.haspassenger =  false;
        }
    }

    update(time){
        this.currentanim.update(time);

        if(this.haspassenger){
            this.#updateNormal(time);
        }
    }

    #updateNormal(time){
        this.x = this.collisionBounds[0] - 0;
        this.y = this.collisionBounds[1] - 11;
        this.camera.update([this.x + this.bounds[2] / 2, this.y + this.bounds[3] / 2])

        this.speed = [0, 0];
        if(Keys.KeyW) this.speed[1] = -Vehicle.SPEED; 
        if(Keys.KeyA) this.speed[0] = -Vehicle.SPEED; 
        if(Keys.KeyS) this.speed[1] = Vehicle.SPEED; 
        if(Keys.KeyD) this.speed[0] = Vehicle.SPEED; 

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

        this.bounds[0] = this.x;
        this.bounds[1] = this.y;

        this.center = [this.x + 16, this.y + 16];

        this.collisionBounds[0] = this.x + 0;
        this.collisionBounds[1] = this.y + 11;
    }

    handleCollision(entity){
        const INF = 10000.0;

        let bounds = entity.collisionBounds;
        let speed = entity.speed;
        if(!ICollision.doOverlapRect(bounds, this.collisionBounds)) return;

        let xdiff = INF;
        let ydiff = INF;

        if(speed[0] != 0){
            if(speed[0] > 0){
                xdiff = bounds[0] + bounds[2] - this.collisionBounds[0];
                if(xdiff > 0){
                    xdiff /= speed[0];
                }else{
                    xdiff = INF;
                }
            }else{
                xdiff = this.collisionBounds[0] + this.collisionBounds[2] - bounds[0];
                if(xdiff > 0){
                    xdiff /= -speed[0];
                }else{
                    xdiff = INF;
                }
            }
        }

        if(speed[1] != 0){
            if(speed[1] > 0){
                ydiff = bounds[1] + bounds[3] - this.collisionBounds[1];
                if(ydiff > 0){
                    ydiff /= speed[1];
                }else{
                    ydiff = INF;
                }
            }else{
                ydiff = this.collisionBounds[1] + this.collisionBounds[3] - bounds[1];
                if(ydiff > 0){
                    ydiff /= -speed[1];
                }else{
                    ydiff = INF;
                }
            }
        }

        if(xdiff < ydiff){
            if(speed[0] > 0){
                bounds[0] = this.collisionBounds[0] - bounds[2];
            }else if(speed[0] < 0){
                bounds[0] = this.collisionBounds[0] + this.collisionBounds[2];
            }
            speed[0] = 0;
        }else if (ydiff < xdiff){
            if(speed[1] >= 0){
                bounds[1] = this.collisionBounds[1] - bounds[3];
            }else if(speed[1] < 0){
                bounds[1] = this.collisionBounds[1] + this.collisionBounds[3];
            }
            speed[1] = 0;
        }
    }

    draw(context, camera = this.camera){
        let bounds = this.currentanim.getBounds();
        let pos = camera.getRelativePosition([this.x * camera.scale, this.y * camera.scale])
        let posx = pos[0];
        let posy = pos[1];
        let width = bounds[2] * camera.scale;
        let height = bounds[3] * camera.scale;

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