
import { Sprite, Texture } from 'pixi.js';
import { Projectile } from './Projectile.js';

export class Building extends Sprite {
  constructor(x = 0, y = 0) {
    // Initialize with tower texture
    super(Texture.from('/assets/tower.png'));
    this.position.set(x, y);
    
    this.width = 64 * 2;
    this.height = 64;
    
    // Offset adjustment
    this.y -= 80;
    
    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2
    };
    
    this.projectiles = [];
    this.radius = 250;
    this.target = null;
    
    // Animation properties
    this.currentFrame = 0;
    this.maxFrames = 19;
    this.animationSpeed = 0.2;
    this.frameCounter = 0;
  }

  update(deltaTime) {
    // Update animation if there's a target or animation is in progress
    if (this.target || (this.currentFrame !== 0)) {
      this.frameCounter += this.animationSpeed * deltaTime;
      
      if (this.frameCounter >= 1) {
        this.frameCounter = 0;
        this.currentFrame = (this.currentFrame + 1) % this.maxFrames;
        
        // Shoot projectile on frame 6
        if (this.currentFrame === 6 && this.target) {
          this.shoot();
        }
      }
    }
    
    // Update all projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      this.projectiles[i].update(deltaTime);
    }
  }

  shoot() {
    const projectile = new Projectile(
      this.center.x - 20,
      this.center.y - 110,
      this.target
    );
    this.projectiles.push(projectile);
    
    // Add projectile to the same parent container as the building
    if (this.parent) {
      this.parent.addChild(projectile);
    }
  }
}
