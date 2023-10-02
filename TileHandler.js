import { TEX_IDS, getTextureBounds } from "./AssetHandler.js"
import { Tile } from "./Tile.js"
import { TileMap } from "./TileMap.js"
export {TileHandler}

const COLLIDABLE = {
    [TEX_IDS.AIR] : false,
    [TEX_IDS.GROUND_1] :false,
    [TEX_IDS.GROUND_2V1] : false,
    [TEX_IDS.GROUND_2V2] : false,
    [TEX_IDS.GROUND_3] : false,
    [TEX_IDS.WALL_1] : true,
    [TEX_IDS.WALL_2] : true,
    [TEX_IDS.WALL_3] : true,
    [TEX_IDS.METAL_WALL_1] : true,
    [TEX_IDS.METAL_FLOOR_1] : false,
    [TEX_IDS.WORK_TABLE_L] : true,
    [TEX_IDS.WORK_TABLE_R] : true,
    [TEX_IDS.MSG] : false,

    [TEX_IDS.CHEST_D] : true,
    [TEX_IDS.CHEST_R] : true,
    [TEX_IDS.CHEST_L] : true,

    [TEX_IDS.TABLE_RL_L] : true,
    [TEX_IDS.TABLE_RL_R] : true,

    [TEX_IDS.TABLE_UD_U] : true,
    [TEX_IDS.TABLE_UD_D] : true,
}

class TileHandler{
    static{
        
    }

    static getCreateTile(id, x, y, z){        
        let texbounds = getTextureBounds(id);
        return new Tile(
            id, [
                x * TileMap.tilewidth,
                y * TileMap.tileheight,
                texbounds[2],
                texbounds[3]
            ], 
            z,
            COLLIDABLE[id],[
                x * TileMap.tilewidth,
                y * TileMap.tileheight,
                TileMap.tilewidth,
                TileMap.tileheight
            ]
        );
    }

    static setTile(tile, id){
        let oldbounds = tile.bounds;
        let texbounds = getTextureBounds(id);
        
        tile.set(id,[
            oldbounds[0],
            oldbounds[1],
            texbounds[2],
            texbounds[3]
        ],  
        COLLIDABLE[id]);
    }
}