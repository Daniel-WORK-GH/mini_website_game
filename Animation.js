import { Time } from "./Time.js";
export { Animation }

class Animation{
    constructor(framecount, frametime, framewidth, frameheight, startx, starty){
        //PUBLIC FRAME DATA
        this.x = startx;
        this.y = starty;
        this.framewidth = framewidth;
        this.frameheight = frameheight;
        
        //INTERNAL VARIABLES    
        this.framecount = framecount; 
        this.frametime = frametime;
        this.startx = startx;
        this.starty = starty;
        this.elptime = 0;
        this.currentframe = 0;
    }

    copy(){
        return new Animation(
            this.framecount,
            this.frametime,
            this.framewidth,
            this.frameheight,
            this.startx,
            this.starty);
    }

    /**
     * @param {Time} time delay from last update 
     */
    update(time){
        this.elptime += time.millis;
        if(this.elptime >= this.frametime){
            this.currentframe++;
            if(this.currentframe >= this.framecount){
                this.currentframe = 0;
            }

            this.x = this.startx + this.framewidth * this.currentframe;
            this.y = this.starty;
            this.elptime = 0;
        }
    }

    getBounds(){
        return [this.x, this.y, this.framewidth, this.frameheight];
    }
}