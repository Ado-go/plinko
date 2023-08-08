let canvas = document.getElementById('canvas');
let credit = document.getElementById('credit');
let ballCost = document.getElementById('ballCost');
let numberOFAutoplay = document.getElementById('numberOFAutoplay');
let toggleAutoPlay = document.getElementById('toggleAutoPlay');
let riskInput = document.getElementById('riskInput');
let rowsInput = document.getElementById('rowsInput')
let ctx = canvas.getContext("2d");
let game = new Plinko(800, 600, ctx, credit, ballCost, rowsInput, riskInput, false, numberOFAutoplay);
game.setPegs();
game.setBaskets();
credit.innerText = 'Credit: ' + game.total;

document.addEventListener('keypress', spawnBall);

toggleAutoPlay.addEventListener('click', autoplay);

riskInput.addEventListener('change', setRisk)

rowsInput.addEventListener('change', setRows)

function setRisk(){
    if(game.balls.length != 0){
        return;
    }
    game.risk = Number(riskInput.value);
    game.setBaskets();
}

function setRows(){
    if(game.balls.length != 0){
        return;
    }
    game.rows = Number(rowsInput.value);
    game.setPegs();
    game.setBaskets();
}

setInterval(update, 1000 / 60);

function update(){
    game.draw();
}

function spawnBall(event){
    if(event.code == 'Space' && game.autoplay == null){
        game.spawnBall();
    }
}

function autoplay(){
    if(game.autoplay == null){
        toggleAutoPlay.innerText = '■';
        game.autoplay = setInterval(startAutoplay, 1000)
        ballCost.disabled = true;
        numberOFAutoplay.disabled = true;
    }
    else{
        toggleAutoPlay.innerText = '►';
        game.resetAutoplay();
    }
}

function startAutoplay(){
    game.startAutoplay();
}