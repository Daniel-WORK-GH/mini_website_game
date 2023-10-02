import { getScreenDim } from "./Screen.js";
import { TileMap } from "./TileMap.js";
export { Camera }

const TESTING = false;

class Camera{
    constructor(){
        this.scale = 1;
        this.center = [0, 0];
        this.position = [0, 0]
        this.lock = false;
    }

    setZoom(value){
        this.scale = value;
    }
    
    setLock(value){
        this.lock = value;
    }  

    update(center){
        this.center = center;
        this.position[0] = center[0];
        this.position[1] = center[1];

        this.center[0] *= this.scale;
        this.center[1] *= this.scale;
        this.center[0] = Math.round(this.center[0]);
        this.center[1] = Math.round(this.center[1]);
        if(this.lock){
            this.#keepInBounds();
        }
        this.center[0] += 0.5;
    }

    #keepInBounds(){
        let screen = getScreenDim();
        screen[0] /= 2;
        screen[1] /= 2;
        console.log()

        if(this.center[0] - screen[0] < 0){
            this.center[0] = screen[0];
        }
        if(this.center[1] - screen[1] < 0){
            this.center[1] = screen[1];
        }

        if(this.center[0] + screen[0] > TileMap.widthpx){
            this.center[0] = TileMap.widthpx - screen[0];
        }
        if(this.center[1] + screen[1] > TileMap.heightpx){
            this.center[1] = TileMap.heightpx - screen[1];
        }
    }

    getRelativePosition(position){
        screen = getScreenDim();
        position = [
            position[0] - (this.center[0] - screen[0] / 2),
            position[1] - (this.center[1] - screen[1] / 2)
        ];

        if(TESTING){
            console.log(`postion: ${position}, center: ${this.center}, screen : ${screen}, relative position : ${position}`)
        }

        return position;
    }
}