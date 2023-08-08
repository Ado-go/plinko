class Peg{
    constructor(r, position, bounce, color){
        this.r = r;
        this.position = position;
        this.bounce = bounce;
        this.color = color;
    }

    switchColor(){
        if(this.color == 'white'){
            this.color = 'lightgreen';
        }
        else{
            this.color = 'white';
        }
    }
}