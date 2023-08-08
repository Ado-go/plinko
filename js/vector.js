class Vector{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    add(vector){
        this.x += vector.x;
        this.y += vector.y;
    }

    sub(vector){
        this.x -= vector.x;
        this.y -= vector.y; 
    }

    rotate(degrees){
        //anticlockwise rotation
        let radians = degrees * (Math.PI / 180);
        let oldX = this.x;
        let oldY = this.y;
        this.x = parseFloat((Math.cos(radians) * oldX - Math.sin(radians) * oldY).toFixed(5));
        this.y = parseFloat((Math.sin(radians) * oldX + Math.cos(radians) * oldY).toFixed(5));
    }
}