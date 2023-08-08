class Ball{
    constructor(r, position, cost, color){
        this.r = r;
        this.position = position;
        this.cost = cost;
        this.velocity = new Vector(0, 0);
        this.acceleration = new Vector(0, 0);
        this.color = color;
        this.initialRandomness = (Math.random() + 0.1);
    }

    addForce(force){
        this.acceleration = force;
    }

    update(){
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity)
        this.acceleration = new Vector(0, 0)
    }
}