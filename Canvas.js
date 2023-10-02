import { TileMap } from "./TileMap.js";
import { Camera } from "./Camera.js";
import { getScreenDim } from "./Screen.js";  
import { Time } from "./Time.js";
import { MapEditor } from "./MapCreator.js";
import { TextboxHandler } from "./TextboxHandler.js";
import { TextBox } from "./TextBox.js";
import { Tile } from "./Tile.js";
import { startBackgroundMusic } from "./AudioHandler.js";
import { Vehicle } from "./Vehicle.js";
export { init }

var canvas = document.getElementById("mycanvas");
var context = canvas.getContext("2d");

var prevtime = new Date();
var currenttime = new Date();;

var player;
var isediting;

function init(_player, _isediting = false){
    player = _player;
    isediting = _isediting;

    if(isediting){
        MapEditor.setViewer(player);
        player.camera.setZoom(4);
        TileMap.addEntity(player);
        TileMap.camera = player.camera;
    }else{
        //startBackgroundMusic();
        player.camera.setLock(true); 
        player.camera.update([
                player.camera.center[0],
                player.camera.center[1],
        ]);
        TileMap.setViewer(player);
        var vehicle = new Vehicle();
        TileMap.addEntity(vehicle);
        TileMap.addEntity(player);

    }

    let screen = getScreenDim();
    setSize(screen);

    setInterval(mainLoop, 1000 / 60);
}

function setSize(screen){
    canvas.width = screen[0];
    canvas.height = screen[1];

    context.webkitImageSmoothingEnabled = false;
    context.mozImageSmoothingEnabled = false;
    context.imageSmoothingEnabled = false;
}

function update(){
    let screen = getScreenDim();

    if(canvas.width != screen[0] || canvas.height != screen[1]){
        setSize(screen);
    } 
}

var frames = 0;
var totalmillis = 0;

function mainLoop(){
    prevtime = currenttime;
    currenttime = new Date();
    let timediff = currenttime - prevtime;
    let time = new Time();
    time.set(timediff);

    update();
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    if(isediting){   
        //TileMap.update(time);
        MapEditor.update(time);
        MapEditor.draw(context);

        player.update(time);
    }else{
        TextboxHandler.update(time, player.bounds);
        TileMap.update(time);
        TileMap.draw(context);
    }

    TextboxHandler.draw(context);
    
    frames++;
    totalmillis += time.millis;
    if(totalmillis >= 1000){
        console.log("frame rate : " + frames);
        frames = 0;
        totalmillis = 0;
    }
}
