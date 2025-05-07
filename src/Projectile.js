
import { Sprite, Texture } from 'pixi.js';

export class Projectile extends Sprite {
  constructor(x = 0, y = 0, enemy) {
    // Initialize with projectile texture
    super(Texture.from('/assets/projectile.png'));
    this.position.set(x, y);
    this.velocity = {
      x: 0,
      y: 0
    };
    this.enemy = enemy;
    this.radius = 10;
  }

  update(deltaTime) {
    const angle = Math.atan2(
      this.enemy.center.y - this.position.y,
      this.enemy.center.x - this.position.x
    );

    const power = 5;
    this.velocity.x = Math.cos(angle) * power;
    this.velocity.y = Math.sin(angle) * power;

    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;
  }
}
