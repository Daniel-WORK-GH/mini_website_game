import { Keys } from "./Keyboard.js";
import { getScreenDim } from "./Screen.js";
import { TextBox } from "./TextBox.js";
import { TileMap } from "./TileMap.js";
export { TextboxHandler }

const TESTING = false;

class TextboxHandler{
    static{
        this.textboxes = [];

        this.pendingmessages = [];
        this.penter = false;

        this.lastmsglength = 0;
        
        if(TESTING){
            this.addMessageToQueue("hello   hello testing2 hello testing2 hello testing2");
        }
    }

    static addMessageToQueue(message){
        this.pendingmessages.push(message)
    }

    static removeMessageFromQueue(){
        this.pendingmessages.pop();
    }

    static createAddTextbox(x, y, z){
        let textbox = new TextBox(
            [TileMap.tilewidth * x,
            TileMap.tileheight * y,
            TileMap.tilewidth,
            TileMap.tileheight],
            "", x, y, z
        )

        this.addTextbox(textbox);
    }

    static addTextbox(textbox){
        this.textboxes.push(textbox);
    }

    static getTextboxAt(x, y, z){
        for(let i = 0; i < this.textboxes.length; i++) {
            let t = this.textboxes[i];
            if (t.x == x && t.y == y && t.z == z){
                return t;
            }
        }
        return null;
    }

    static update(time, bounds){
        for (let i = 0; i < this.textboxes.length; i++) {
            this.textboxes[i].handleCollision(bounds);     
        }

        if(Keys.Enter && !this.penter){
            if(this.pendingmessages.length == 0) return;

            if(this.lastmsglength != this.pendingmessages[0].length){
                this.pendingmessages[0] = this.pendingmessages[0].slice(this.lastmsglength).trim();
                console.log(this.lastmsglength)
                console.log(this.pendingmessages[0].length)
            }else{
                this.pendingmessages.shift();
            }
            this.penter = true; 
        }else{
            this.penter = Keys.Enter;
        }
    }
    
    static draw(context){
        this.lastmsglength = 0;
        if(this.pendingmessages.length ==  0) return;

        let screen = getScreenDim();
        let xdiff = screen[0] * 0.02;
        let ydiff = screen[1] * 0.02;

        let startx = screen[0] * 0.05;
        let starty = screen[1] * 0.65;
        let width = Math.round(screen[0] * 0.9);
        let height = Math.round(screen[1] * 0.3);
        
        this.#drawtextbox(context, startx, starty, width, height);

        let fontsize = 40;
        this.#printlines(context,
            fontsize,
            xdiff + startx,
            ydiff + fontsize + starty,
            width - xdiff,
            height - ydiff,
            fontsize + ydiff);

        this.printedmsg = true;
    }

    static #drawtextbox(context, startx, starty, width, height){
        context.clearRect(startx, starty, width, height);

        context.beginPath();
        context.lineWidth = "5";
        context.strokeStyle = "black";
        context.rect(startx, starty, width, height);
        context.stroke();
    }

    static #printlines(context, fontsize, startx, starty , width, height, lineheight){
        context.beginPath();
        //HACK : REMAKE USING SINGLE LETTERS NOT WHOLE WORDS
        //PLUS CURRENT CODE IS WRITTEN VERY POORLY 
        context.font = `${fontsize}px minecraft`;
        let words = this.pendingmessages[0].split(' ');
        let text = words[0];
        let currentline = 0;
        let msglength = 0;

        let totalheight = 0;

        for(let i = 1; i < words.length && totalheight <= height; i++){
            if(context.measureText(`${text} ${words[i]}`).width > width){
                context.fillText(text, startx, starty + currentline * lineheight);
                msglength += text.length + 1;
                text = words[i];
                currentline++;
                totalheight += lineheight;
            }else{
                text += " " + words[i];
            }
        }
        if(totalheight <= height){
            context.fillText(text, startx, starty + currentline * lineheight);
        }

        msglength += text.length;
        this.lastmsglength = msglength;
        context.stroke();
    }
}