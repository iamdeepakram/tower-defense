
import { Graphics } from 'pixi.js';

export class PlacementTile extends Graphics {
  constructor(x = 0, y = 0) {
    super();
    this.position.set(x, y);
    this.size = 64;
    this.color = 0xFFFFFF;
    this.alpha = 0.15;
    this.occupied = false;
    this.eventMode = 'static';
    this.cursor = 'pointer';
    this.draw();
  }

  draw() {
    this.clear();
    this.beginFill(this.color);
    this.drawRect(0, 0, this.size, this.size);
    this.endFill();
  }

  update(mouseX, mouseY) {
    if (
      mouseX > this.position.x &&
      mouseX < this.position.x + this.size &&
      mouseY > this.position.y &&
      mouseY < this.position.y + this.size
    ) {
      this.alpha = 1;
    } else {
      this.alpha = 0.15;
    }
  }
}
