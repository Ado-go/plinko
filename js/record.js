class Record{
    constructor(width, height, position, ballCost, basketMultiplier){
        this.width = width;
        this.height = height;
        this.position = position;
        this.ballCost = ballCost;
        this.basketMultiplier = basketMultiplier;
        this.color = basketMultiplier >= 1 ? 'green' : 'red';
    }
}