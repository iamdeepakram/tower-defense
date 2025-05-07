
import { Sprite as PixiSprite, Texture, Rectangle } from 'pixi.js';

export class Sprite extends PixiSprite {
  constructor({ 
    position = { x: 0, y: 0 },
    imageSrc,
    frames = { max: 1 },
    offset = { x: 0, y: 0 }
  }) {
    // Create base texture
    const baseTexture = Texture.from(imageSrc);
    
    // Calculate frame width
    const frameWidth = baseTexture.width / frames.max;
    
    // Create texture for first frame
    const texture = new Texture(
      baseTexture.baseTexture,
      new Rectangle(0, 0, frameWidth, baseTexture.height)
    );
    
    // Initialize PixiJS sprite
    super(texture);
    
    // Set position and offset
    this.position.set(position.x + offset.x, position.y + offset.y);
    
    // Animation properties
    this.frames = {
      max: frames.max,
      current: 0,
      elapsed: 0,
      hold: 3,
      width: frameWidth
    };
  }

  update(deltaTime = 1) {
    // Handle animation
    this.frames.elapsed++;
    if (this.frames.elapsed % this.frames.hold === 0) {
      this.frames.current++;
      if (this.frames.current >= this.frames.max) {
        this.frames.current = 0;
      }
      
      // Update texture frame
      this.texture.frame = new Rectangle(
        this.frames.width * this.frames.current,
        0,
        this.frames.width,
        this.texture.height
      );
    }
  }
}
