export { MouseButtons, MousePosition, mouseClickEvent, mouseMoveEvent }

const TESTING = false;

const LEFT = 0;
const MIDDLE = 1;
const RIGHT = 2;

const MouseButtons = {
    LEFT : false,
    MIDDLE : false,
    RIGHT : false
}

const MousePosition = {
    X : 0,
    Y : 0
}

const LookUp = {
    [LEFT] : "LEFT",
    [MIDDLE] : "MIDDLE",
    [RIGHT] : "RIGHT",
}

function mouseClickEvent(e) {
    if (MouseButtons[LookUp[e.button]] !== undefined) {
        MouseButtons[LookUp[e.button]] = e.type == "mousedown";
    }

    if(TESTING){
        console.log(`LookUp[e.button] = ${LookUp[e.button]}`)
        console.log(`MouseButtons[LookUp[e.button]] = ${MouseButtons[LookUp[e.button]]}`)
        console.log(`type = ${e.type}`)
    }
}

function mouseMoveEvent(e){
    let x = e.clientX;
    let y = e.clientY;

    MousePosition.X = x;
    MousePosition.Y = y;

    if(TESTING){
        console.log(`mouse position : ${x},${y}`);
    }
}