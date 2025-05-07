import { Sprite, Texture } from 'pixi.js';
import { waypoints } from './waypoints.js';

export class Enemy extends Sprite {
  constructor(x = 0, y = 0) {
    // Initialize with orc texture
    const texture = Texture.from('/assets/orc.png');
    super(texture);

    this.position.set(x, y);
    this.width = 100;
    this.height = 100;

    this.waypointIndex = 0;
    this.radius = 50;
    this.health = 100;
    this.maxHealth = 100;

    this.velocity = {
      x: 0,
      y: 0
    };
  }

  update(deltaTime) {
    const waypoint = waypoints[this.waypointIndex];
    const yDistance = waypoint.y - this.position.y;
    const xDistance = waypoint.x - this.position.x;
    const angle = Math.atan2(yDistance, xDistance);

    const speed = 2;
    this.velocity.x = Math.cos(angle) * speed;
    this.velocity.y = Math.sin(angle) * speed;

    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;

    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2
    };

    if (
      Math.abs(Math.round(this.center.x) - Math.round(waypoint.x)) < Math.abs(this.velocity.x) &&
      Math.abs(Math.round(this.center.y) - Math.round(waypoint.y)) < Math.abs(this.velocity.y) &&
      this.waypointIndex < waypoints.length - 1
    ) {
      this.waypointIndex++;
    }
  }
}