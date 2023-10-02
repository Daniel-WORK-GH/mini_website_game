import { Animation } from "./Animation.js"
export { TEX_IDS, getTextureBounds, SHEET, getAnimation}

const PATH = 'assets/';

const TEX_IDS = { //LAST ID : 18
    AIR : 0,
    GROUND_1 : 1,
    GROUND_2V1 : 10,
    GROUND_2V2 : 11,
    GROUND_3 : 12,
    WALL_1 : 2,
    WALL_2 : 4,
    WALL_3 : 5,
    METAL_WALL_1 : 6,
    METAL_FLOOR_1 : 7,
    WORK_TABLE_L : 8,
    WORK_TABLE_R : 9,
    MSG : 3,

    CHEST_D : 13,
    CHEST_R : 14,
    CHEST_L : 15,

    TABLE_RL_L : 16,
    TABLE_RL_R : 17,

    TABLE_UD_U : 18,
    TABLE_UD_D : 19,

    PLAYER_IDLE : 100,
    PLAYER_RUN : 101,

    ROVER_IDLE : 200,
    ROVER_DRIVE : 201,
}

const TILE_BOUNDS = {
    [TEX_IDS.AIR] : [0,0,0,0],
    [TEX_IDS.GROUND_1] : [0,0,16,16],
    [TEX_IDS.GROUND_2V1] : [0,64,16,16],
    [TEX_IDS.GROUND_2V2] : [0,80,16,16],
    [TEX_IDS.GROUND_3] : [16,80,16,16],
    [TEX_IDS.WALL_1] : [48,0,16,26],
    [TEX_IDS.WALL_2] : [32,0,16,29],
    [TEX_IDS.WALL_3] : [16,0,16,32],
    [TEX_IDS.METAL_WALL_1] : [48,48,16,26],
    [TEX_IDS.METAL_FLOOR_1] : [0,48,16,16],
    [TEX_IDS.WORK_TABLE_L] : [16,48,16,20],
    [TEX_IDS.WORK_TABLE_R] : [32,48,16,20],

    [TEX_IDS.CHEST_D] : [64,48,16,21],
    [TEX_IDS.CHEST_R] : [80,48,16,21],
    [TEX_IDS.CHEST_L] : [96,48,16,21],

    [TEX_IDS.TABLE_RL_L] : [32,80,16,20],
    [TEX_IDS.TABLE_RL_R] : [48,80,16,20],

    [TEX_IDS.TABLE_UD_U] : [64,75,16,21],
    [TEX_IDS.TABLE_UD_D] : [64,96,16,16],
    
    [TEX_IDS.MSG] : [0,16,16,16],
}

const ANIMATIONS = {
    [TEX_IDS.PLAYER_IDLE] : new Animation(4, 250, 16, 16, 64, 0),
    [TEX_IDS.PLAYER_RUN] : new Animation(4, 135, 16, 17, 64, 16),
    [TEX_IDS.ROVER_IDLE] : new Animation(1, 4000, 32, 29, 144, 80),
    [TEX_IDS.ROVER_DRIVE] : new Animation(2, 400, 32, 29, 80, 80),
}

var SHEET;
SHEET = loadimage('spritesheet.png');

function loadimage(name){
    let img = new Image();
    img.src = PATH + name;
    return img;
}

function getTextureBounds(id){
    return TILE_BOUNDS[id];
}

/**
 * @param {*} id 
 * @returns { Animation }
 */
function getAnimation(id){
    return ANIMATIONS[id].copy();
}

function getStaticImage(){
    
}