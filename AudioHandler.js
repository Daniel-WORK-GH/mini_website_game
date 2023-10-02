export {startBackgroundMusic, SOUND_EFFECTS, playEffect}

//myaudio=document.getElementById("audio1");
//myaudio.playbackRate=0.5;

const SOUND_EFFECTS = {
    WALKING : 'sounds/ambient.mp3',
}

function startBackgroundMusic(){
    var audio = new Audio('sounds/ambient.mp3')
    audio.volume = 0.05;

    audio.addEventListener('ended', function() {
        setTimeout(()=> {
            this.currentTime = 0;
            this.play();
        },60000);
    }, false);
    audio.play();
}

function playEffect(effect){
    var audio = new Audio(effect)
    audio.volume = 0.5;
    audio.play();
}