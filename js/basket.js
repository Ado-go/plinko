class Basket{
    constructor(width, height, position, multiplier){
        this.width = width;
        this.height = height;
        this.position = position;
        this.multiplier = multiplier;
        this.color = this.basketColor(multiplier);
    }

    animateBasket(){
        this.position.y += 2;
        setTimeout(() => {
            this.position.y -= 2;
        }, 100);
    }
    
    basketColor(multiplier){
        multiplier += 0.1;
        let redColor = 150 * multiplier;
        let greenColor = 150 / multiplier;
        let color = 'rgb( ' + redColor + ', '+ greenColor +', 5)';
        return color
    }
}