import { ICollision } from "./ICollision.js";
import { KeyLookup, addKeyboardBlocker, removeKeyboardBlocker } from "./Keyboard.js";
import { TextboxHandler } from "./TextboxHandler.js";
export {TextBox}

const TESTING = false;

class TextBox extends ICollision{
    constructor(bounds, msg, x, y, z){
        super();
        let xdiff = bounds[2] / 4;
        let ydiff = bounds[3] / 4;
 
        this.bounds = bounds;
        this.bounds[0] += xdiff;
        this.bounds[1] += ydiff;
        this.bounds[2] /= 2;
        this.bounds[3] /= 2;
        this.msg = msg;

        this.wasoverlaped = false;
        
        this.x = x;
        this.y = y;
        this.z = z;
    }

    setMsg(msg){
        this.msg = msg;
    }

    startCreating(){
        addKeyboardBlocker(this, this.onCreating);
        TextboxHandler.addMessageToQueue(this.msg);
    }

    onCreating(s, e){
        let l = KeyLookup[e.code];
        var caps = e.getModifierState && e.getModifierState('CapsLock');

        if(e.type == "keydown"){
            if(l != undefined){
                s.msg += l[caps ? 1 : 0];
            }else if (e.code == "Space"){
                s.msg += ' ';
            }else if (e.code == "Backspace"){
                s.msg = s.msg.slice(0, -1);
            }else if (e.code == "Comma"){
                s.msg += ',';
            }else if (e.code == "Period"){
                s.msg += '.';
            }
        }
        TextboxHandler.removeMessageFromQueue();
        TextboxHandler.addMessageToQueue(s.msg);
    }
    
    stopCreating(){
        removeKeyboardBlocker(this.onCreating);
        TextboxHandler.removeMessageFromQueue();
    }

    handleCollision(bounds){
        let overlap = TextBox.doOverlapRect(this.bounds, bounds);
        if(TESTING){
            console.log(`textbox:${this.bounds}  player:${bounds}`)
        }

        if(!overlap) {
            this.wasoverlaped = false;
            return;
        }
        if(this.wasoverlaped){
            return;
        }

        TextboxHandler.addMessageToQueue(this.msg);
        this.wasoverlaped = true;
    }
}