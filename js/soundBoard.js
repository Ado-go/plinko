class SoundBoard{
    constructor(on){
        this.sounds = {
            'hit': '/sound/pegHit.wav',
            'win': '/sound/win.wav',
            'lose': '/sound/lose.wav'
        }
        this.on = on
    }

    playSound(sound, volume){
        if(!this.on){
            return;
        }
        let newSound = new Audio(this.sounds[sound]);
        newSound.volume = volume;
        newSound.play(); 
    }
}