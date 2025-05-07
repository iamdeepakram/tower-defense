
import { Application, Assets, Sprite, Container } from "pixi.js";
import { Enemy } from './Enemy.js';
import { PlacementTile } from './PlacementTile.js';
import { Building } from './Building.js';
import { waypoints } from './waypoints.js';
import { placementTilesData } from './placementTilesData.js';

(async () => {
  // Create application
  const app = new Application();
  await app.init({ 
    background: "#FFFFFF",
    width: 1280,
    height: 768,
    resizeTo: window 
  });

  document.getElementById("pixi-container").appendChild(app.canvas);

  // Load game assets
  await Assets.load([
    "/assets/gameMap.png",
    "/assets/explosion.png",
    "/assets/orc.png",
    "/assets/tower.png",
    "/assets/projectile.png"
  ]);
  const gameMap = Texture.from("/assets/gameMap.png");
  const explosionTexture = Texture.from("/assets/explosion.png");

  // Create game map
  const map = new Sprite(gameMap);
  app.stage.addChild(map);

  // Game state
  const enemies = [];
  const buildings = [];
  const explosions = [];
  const placementTiles = [];
  let activeTile = undefined;
  let enemyCount = 3;
  let hearts = 10;
  let coins = 100;

  // Create placement tiles
  const placementTilesData2D = [];
  for (let i = 0; i < placementTilesData.length; i += 20) {
    placementTilesData2D.push(placementTilesData.slice(i, i + 20));
  }

  placementTilesData2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
      if (symbol === 14) {
        const tile = new PlacementTile(x * 64, y * 64);
        placementTiles.push(tile);
        app.stage.addChild(tile);
      }
    });
  });

  function spawnEnemies(spawnCount) {
    for (let i = 1; i < spawnCount + 1; i++) {
      const xOffset = i * 150;
      const enemy = new Enemy(waypoints[0].x - xOffset, waypoints[0].y);
      enemies.push(enemy);
      app.stage.addChild(enemy);
    }
  }

  // Initial enemy spawn
  spawnEnemies(enemyCount);

  // Game loop
  app.ticker.add((time) => {
    // Update enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
      const enemy = enemies[i];
      enemy.update(time.deltaTime);

      if (enemy.position.x > app.screen.width) {
        hearts -= 1;
        enemies.splice(i, 1);
        enemy.destroy();
        document.querySelector('#hearts').innerHTML = hearts;

        if (hearts === 0) {
          app.ticker.stop();
          document.querySelector('#gameOver').style.display = 'flex';
        }
      }
    }

    // Update explosions
    for (let i = explosions.length - 1; i >= 0; i--) {
      const explosion = explosions[i];
      explosion.update(time.deltaTime);
      if (explosion.frames.current >= explosion.frames.max - 1) {
        explosion.destroy();
        explosions.splice(i, 1);
      }
    }

    // Spawn new wave
    if (enemies.length === 0) {
      enemyCount += 2;
      spawnEnemies(enemyCount);
    }

    // Update buildings
    buildings.forEach((building) => {
      building.update(time.deltaTime);
      building.target = null;
      const validEnemies = enemies.filter((enemy) => {
        const xDifference = enemy.center.x - building.center.x;
        const yDifference = enemy.center.y - building.center.y;
        const distance = Math.hypot(xDifference, yDifference);
        return distance < enemy.radius + building.radius;
      });
      building.target = validEnemies[0];

      // Update projectiles
      for (let i = building.projectiles.length - 1; i >= 0; i--) {
        const projectile = building.projectiles[i];
        projectile.update(time.deltaTime);

        const xDifference = projectile.enemy.center.x - projectile.position.x;
        const yDifference = projectile.enemy.center.y - projectile.position.y;
        const distance = Math.hypot(xDifference, yDifference);

        if (distance < projectile.enemy.radius + projectile.radius) {
          projectile.enemy.health -= 20;
          if (projectile.enemy.health <= 0) {
            const enemyIndex = enemies.findIndex((enemy) => projectile.enemy === enemy);
            if (enemyIndex > -1) {
              const enemy = enemies[enemyIndex];
              enemies.splice(enemyIndex, 1);
              enemy.destroy();
              coins += 25;
              document.querySelector('#coins').innerHTML = coins;
            }
          }

          const explosion = new Sprite({
            position: { x: projectile.position.x, y: projectile.position.y },
            imageSrc: explosionTexture,
            frames: { max: 4 },
            offset: { x: 0, y: 0 }
          });
          explosions.push(explosion);
          app.stage.addChild(explosion);
          
          projectile.destroy();
          building.projectiles.splice(i, 1);
        }
      }
    });

    // Update placement tiles
    if (mouse) {
      placementTiles.forEach(tile => tile.update(mouse.x, mouse.y));
    }
  });

  // Mouse handling using PixiJS events
  const mouse = { x: 0, y: 0 };

  app.stage.eventMode = 'static';
  app.stage.on('pointerdown', (event) => {
    mouse.x = event.global.x;
    mouse.y = event.global.y;
    if (activeTile && !activeTile.occupied && coins - 50 >= 0) {
      coins -= 50;
      document.querySelector('#coins').innerHTML = coins;
      
      const building = new Building(activeTile.position.x, activeTile.position.y);
      buildings.push(building);
      app.stage.addChild(building);
      
      activeTile.occupied = true;
      buildings.sort((a, b) => a.position.y - b.position.y);
    }
  });

  app.stage.on('pointermove', (event) => {
    const pos = event.global;
    mouse.x = pos.x;
    mouse.y = pos.y;

    activeTile = null;
    for (const tile of placementTiles) {
      if (
        mouse.x > tile.position.x &&
        mouse.x < tile.position.x + tile.size &&
        mouse.y > tile.position.y &&
        mouse.y < tile.position.y + tile.size
      ) {
        activeTile = tile;
        break;
      }
    }
  });
})();
