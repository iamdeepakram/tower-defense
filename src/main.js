import { Application, Assets, Sprite, Graphics } from "pixi.js";

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ background: "#1099bb", resizeTo: window });

  // Append the application canvas to the document body
  document.getElementById("pixi-container").appendChild(app.canvas);

  // Load the bunny texture
  const texture = await Assets.load("/assets/gameMap.png");

  // Create a bunny Sprite
  const bunny = new Sprite(texture);

  // Center the sprite's anchor point
  bunny.anchor.set(0.5);

  // Move the sprite to the center of the screen
  bunny.position.set(app.screen.width / 2, app.screen.height / 2);

  // Add the bunny to the stage
  app.stage.addChild(bunny);

  // Draw a rectangle using Graphics
  // For it is our enemy.
  const enemy = new Graphics();
  enemy.fill(0xde3249); // Set the fill color
  enemy.rect(50, 50, 100, 100); // Draw a rectangle at (50, 50) with width 100 and height 100
  enemy.fill();

  // Add the enemy to the stage
  app.stage.addChild(enemy);

  let enemySpeed = 2;

  app.ticker.add((time) => {
    // Move the enemy to the right
    enemy.x += enemySpeed;

    // Reset position if it goes off screen
    if (enemy.x > app.screen.width) {
      enemy.x = -enemy.width * time.deltaTime;
    }
  });
  app.ticker.add((time) => {
    // Just for fun, let's rotate mr rabbit a little.
    // * Delta is 1 if running at 100% performance *
    // * Creates frame-independent transformation *
    // bunny.rotation += 0.1 * time.deltaTime;
  });
})();
