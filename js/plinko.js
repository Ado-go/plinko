class Plinko {
  constructor(
    width,
    height,
    ctx,
    credit,
    ballCostInput,
    rowsInput,
    riskInput,
    sound,
    autoplayInput
  ) {
    this.width = width;
    this.height = height;
    this.rows = Number(rowsInput.value);
    this.credit = credit;
    this.ballCostInput = ballCostInput;
    this.autoplayInput = autoplayInput;
    this.rowsInput = rowsInput;
    this.riskInput = riskInput;
    this.autoplay = null;
    this.risk = Number(riskInput.value);
    this.ballSize = 10;
    this.gravity = new Vector(0, 0.2);
    this.ctx = ctx;
    this.balls = [];
    this.pegs = [];
    this.baskets = [];
    this.history = new History([], 1, 8);
    this.total = 1000;
    this.soundBoard = new SoundBoard(sound);
  }

  drawCircle(ball) {
    this.ctx.fillStyle = ball.color;
    this.ctx.beginPath();
    this.ctx.ellipse(
      ball.position.x,
      ball.position.y,
      ball.r,
      ball.r,
      0,
      0,
      2 * Math.PI
    );
    this.ctx.fill();
  }

  drawRectangle(rect) {
    this.ctx.fillStyle = rect.color;
    this.ctx.beginPath();
    this.ctx.roundRect(
      rect.position.x,
      rect.position.y,
      rect.width,
      rect.height,
      5
    );
    this.ctx.fill();
  }

  drawBasket(basket) {
    this.drawRectangle(basket);
    this.ctx.fillStyle = "black";
    ctx.font = "10px Arial";
    ctx.fillText(
      basket.multiplier,
      basket.position.x + basket.width / 2 - 5,
      basket.position.y + basket.height / 2
    );
  }

  drawRecord(record) {
    this.drawRectangle(record);
    this.ctx.fillStyle = "white";
    ctx.font = "10px Arial";
    ctx.fillText(
      "   PAYOUT: " +
        record.basketMultiplier +
        "   PROFIT: " +
        parseFloat(
          record.ballCost * record.basketMultiplier - record.ballCost
        ).toFixed(2),
      record.position.x + 5,
      record.position.y + record.height / 2
    );
  }

  spawnBall() {
    this.lockSettings(true);

    if (this.ballCostInput.value == "") {
      this.ballCostInput.value = 1;
    }
    if (this.ballCostInput.value > this.total) {
      return false;
    }

    let newBall = new Ball(
      this.ballSize,
      new Vector(this.width / 2, this.ballSize),
      parseFloat(this.ballCostInput.value),
      "red"
    );
    this.balls.push(newBall);
    this.total -= parseFloat(this.ballCostInput.value);
    this.credit.innerText = "Credit: " + this.total;

    return true;
  }

  lockSettings(set) {
    this.rowsInput.disabled = set;
    this.riskInput.disabled = set;
  }

  startAutoplay() {
    if (this.autoplayInput.value <= 0) {
      this.resetAutoplay();
      toggleAutoPlay.innerText = "►";
      return;
    }
    if (this.spawnBall()) {
      this.autoplayInput.value -= 1;
    } else {
      toggleAutoPlay.innerText = "■";
      this.resetAutoplay();
    }
  }

  resetAutoplay() {
    clearInterval(this.autoplay);
    game.autoplay = null;
    ballCost.disabled = false;
    numberOFAutoplay.disabled = false;
  }

  setPegs() {
    let startNumOfPegs = 3;
    this.pegs = [];
    for (let i = 0; i < this.rows; i++) {
      let padding = -40 * (i + 1);
      let shift = 20;
      for (let j = 0; j < startNumOfPegs; j++) {
        let peg = new Peg(
          this.ballSize / 2,
          new Vector(this.width / 2 + padding + shift * i, i * 40 + 40),
          1,
          "white"
        );
        this.pegs.push(peg);
        padding += 40;
      }
      startNumOfPegs++;
    }
  }

  setBasketMultiplier() {
    let multipliers = [];
    let difficulty = [1, 0.5, 0.34];
    let difficultyMult = difficulty[this.risk];
    let incrementSpeed = [0.4, 0.8, 1.2];
    let increment = 0.4;
    let nextIncrement = 0;
    for (let i = 0; i < Math.floor(this.rows / 2) + 1; i++) {
      if (i == 0) {
        multipliers.push(0.2);
      } else {
        if (nextIncrement >= 1) {
          increment += incrementSpeed[this.risk] / difficultyMult;
          nextIncrement = difficultyMult;
        } else {
          nextIncrement += difficultyMult;
        }
        let nextNumber = 0.2 + increment;
        console.log(i, increment);
        multipliers.push(parseFloat(nextNumber.toFixed(1)));
        multipliers.unshift(parseFloat(nextNumber.toFixed(1)));
      }
    }
    return multipliers;
  }

  setBaskets() {
    this.baskets = [];
    let multipliers = this.setBasketMultiplier();
    for (let i = 0; i < this.rows + 1; i++) {
      let padding = -40 * (i + 1);
      let shift = (Math.round(this.rows / 2) + 1) * 40;
      let basket = new Basket(
        30,
        30,
        new Vector(
          this.width / 2 - 15 + padding + shift,
          (this.rows - 1) * 40 + 40
        ),
        multipliers[i]
      );
      this.baskets.push(basket);
    }
  }

  addProfit(ball, basket) {
    this.balls = this.balls.filter((e) => e !== ball);

    if (this.balls.length == 0) {
      this.lockSettings(false);
    }

    this.total += ball.cost * basket.multiplier;

    this.total = parseFloat(this.total.toFixed(2));

    basket.animateBasket();

    this.history.addRecord(ball, basket, this.width);

    if (basket.multiplier > 1) {
      this.soundBoard.playSound("win", 0.1);
      this.credit.innerText = "Credit: " + this.total;
    } else {
      this.soundBoard.playSound("lose", 0.1);
      this.credit.innerText = "Credit: " + this.total;
    }
  }

  ballOutsideGame(ball, basket, left) {
    if (left) {
      if (
        ball.position.x < basket.position.x &&
        ball.position.y >= basket.position.y &&
        ball.position.y <= basket.position.y + basket.height
      ) {
        this.addProfit(ball, basket);
      }
    } else {
      if (
        ball.position.x > basket.position.x &&
        ball.position.y >= basket.position.y &&
        ball.position.y <= basket.position.y + basket.height
      ) {
        this.addProfit(ball, basket);
      }
    }
  }

  ballInBasket(ball) {
    for (let basket of this.baskets) {
      if (
        this.baskets.indexOf(basket) == 0 ||
        this.baskets.indexOf(basket) == this.baskets.length - 1
      ) {
        if (this.baskets.indexOf(basket) == 0) {
          this.ballOutsideGame(ball, basket, false);
        } else {
          this.ballOutsideGame(ball, basket, true);
        }
      }
      if (
        ball.position.x >= basket.position.x &&
        ball.position.x <= basket.position.x + basket.width &&
        ball.position.y >= basket.position.y &&
        ball.position.y <= basket.position.y + basket.height
      ) {
        this.addProfit(ball, basket);
      }
    }
  }

  randomPositiveOrNegativeOne() {
    return Math.round(Math.random()) * 2 - 1;
  }

  adjustBall(ball, peg) {
    let distanceX = peg.position.x - ball.position.x;

    let distanceY = peg.position.y - ball.position.y;

    if (distanceX > 0) {
      ball.position.x -=
        ball.r +
        peg.r -
        Math.sqrt(Math.abs(distanceX) ** 2 + Math.abs(distanceY) ** 2);
    }

    if (distanceX < 0) {
      ball.position.x +=
        ball.r +
        peg.r -
        Math.sqrt(Math.abs(distanceX) ** 2 + Math.abs(distanceY) ** 2);
    }

    if (distanceY > 0) {
      ball.position.y -=
        ball.r +
        peg.r -
        Math.sqrt(Math.abs(distanceX) ** 2 + Math.abs(distanceY) ** 2);
    }

    if (distanceY < 0) {
      ball.position.y +=
        ball.r +
        peg.r -
        Math.sqrt(Math.abs(distanceX) ** 2 + Math.abs(distanceY) ** 2);
    }
  }

  updateBallPosition(ball) {
    ball.addForce(this.gravity);
    for (let peg of this.pegs) {
      if (
        Math.sqrt(
          Math.abs(peg.position.x - ball.position.x) ** 2 +
            Math.abs(peg.position.y - ball.position.y) ** 2
        ) <=
        ball.r + peg.r
      ) {
        this.adjustBall(ball, peg);

        this.soundBoard.playSound("hit", 0.1);

        if (ball.initialRandomness != 0) {
          ball.addForce(
            new Vector(
              ball.initialRandomness * this.randomPositiveOrNegativeOne(),
              (ball.position.y - peg.position.y) / 4
            )
          );
          ball.initialRandomness = 0;
        } else {
          let impactVector = new Vector(
            ball.position.x - peg.position.x,
            ball.position.y - peg.position.y
          );
          let cSideTriangle = Math.sqrt(
            impactVector.x ** 2 + impactVector.y ** 2
          );
          let divider = Math.abs(impactVector.x);
          if (divider > Math.abs(impactVector.y)) {
            divider = impactVector.y;
          } else {
            divider = impactVector.x;
          }
          let angleShift =
            Math.asin((1 / cSideTriangle) * divider) * (180 / Math.PI);

          let bounceVector = impactVector;
          bounceVector.rotate(angleShift);

          bounceVector.x = bounceVector.x / 11;
          bounceVector.y = bounceVector.y / 8;
          ball.velocity = bounceVector;
        }

        peg.switchColor();
      }
    }
    ball.update();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    for (let ball of this.balls) {
      this.updateBallPosition(ball);
      this.ballInBasket(ball);
      this.drawCircle(ball);
    }
    for (let peg of this.pegs) {
      this.drawCircle(peg);
    }

    for (let basket of this.baskets) {
      this.drawBasket(basket);
    }

    for (
      let i = this.history.history.length - 1;
      i >= 0 &&
      i > this.history.history.length - (1 + this.history.maxVisibleRecords);
      i--
    ) {
      this.drawRecord(this.history.history[i]);
    }
  }
}
