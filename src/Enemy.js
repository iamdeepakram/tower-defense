
import { Graphics } from 'pixi.js';

export class Enemy extends Graphics {
  constructor(x, y, speed = 2) {
    super();
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.init();
  }

  init() {
    this.fill(0xde3249);
    this.rect(0, 0, 100, 100);
    this.fill();
  }

  update(screenWidth, deltaTime) {
    this.x += this.speed;
    if (this.x > screenWidth) {
      this.x = -this.width * deltaTime;
    }
  }
}
