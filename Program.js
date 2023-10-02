import { init as initcanvas } from "./Canvas.js";
import { keyEvent } from "./Keyboard.js";
import { mouseClickEvent, mouseMoveEvent } from "./Mouse.js";
import { Player } from "./Player.js";
import { onScreenResize } from "./Screen.js";
import { TileMap } from "./TileMap.js";
import { Vehicle } from "./Vehicle.js";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const EDITING = urlParams.get('editing')

window.addEventListener('resize', onScreenResize, true);

var player = new Player();

document.addEventListener('keydown', keyEvent);
document.addEventListener('keyup', keyEvent);  
document.addEventListener('mousedown', mouseClickEvent);
document.addEventListener('mouseup', mouseClickEvent);
document.addEventListener('mousemove', mouseMoveEvent);

initcanvas(player, EDITING === "true");

//TODO : REMOVE USE OF ICOLLISION 