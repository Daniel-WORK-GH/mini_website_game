import { ICollision } from "./ICollision.js";

export {Tile}

class Tile extends ICollision{
    constructor(id, bounds, layer, iscollidable, collisionBounds){
        super();
        this.id = id;
        this.bounds = bounds;
        this.layer = layer;
        this.iscollidable = iscollidable;
        if(this.iscollidable){
            this.collisionBounds = collisionBounds;
        }
    }

    set(id, bounds, iscollidable){
        this.id = id;
        this.bounds = bounds;
        this.iscollidable = iscollidable;
    }

    handleCollision(entity){
        const INF = 10000.0;
        if(!this.iscollidable) return;

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
}