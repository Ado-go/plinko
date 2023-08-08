class History{
    constructor(history, position, maxVisibleRecords){
        this.history = history;
        this.position = position;
        this.maxVisibleRecords = maxVisibleRecords;
    }

    addRecord(ball, basket, width){
        if(this.position == 11){
            this.adjustRecords();
            this.position = 10;
        }
        let record = new Record(width / 4, 20, new Vector(10, this.position * 24), ball.cost, basket.multiplier)
        this.history.push(record);
        this.position++;
    }

    adjustRecords(){
        for(let i=this.history.length - 1; i >= 0 && i > this.history.length - (1 + this.maxVisibleRecords); i--){
            for(let j=0; j < 6; j++){
                setTimeout(() => {
                    this.history[i].position.sub(new Vector(0, 4));
                }, 20 * j);
            }
        }
    }
}