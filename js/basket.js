class Basket {
  constructor(width, height, position, multiplier) {
    this.width = width;
    this.height = height;
    this.position = position;
    this.multiplier = multiplier;
    this.color = this.basketColor(multiplier);
  }

  animateBasket() {
    this.position.y += 2;
    setTimeout(() => {
      this.position.y -= 2;
    }, 100);
  }

  basketColor(multiplier) {
    multiplier += 0.1;
    85, 245, 32;
    let color = "rgb(0,0,0)";
    if (multiplier <= 1) {
      color = "rgb( " + 85 * multiplier + ", " + 245 + ", 32)";
    } else if (multiplier <= 10) {
      color = "rgb( " + 85 + 20 * multiplier + ", " + 245 + ", 32)";
    } else {
      color = "rgb(245, 64, 32)";
    }
    return color;
  }
}
