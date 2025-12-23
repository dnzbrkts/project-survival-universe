const config = {
  type: Phaser.AUTO,
  parent: "game",
  width: 960,
  height: 540,
  backgroundColor: "#1a1a1a",
  physics: {
    default: "arcade",
    arcade: { debug: false }
  },
  scene: { preload, create, update }
};

const game = new Phaser.Game(config);

let player, zombie, loot, cursors, wasd, infoText;

function preload() {}

function create() {
  // Player
  player = this.add.rectangle(200, 200, 26, 26, 0xffffff);
  this.physics.add.existing(player);
  player.body.setCollideWorldBounds(true);

  //Player2
  player2= this.add.rectangle(300,300,26,26, 0xFF4500);
  this.physics.add.existing(player2);
  player2.body.setCollideWorldBounds(true);

  // Zombie
  zombie = this.add.rectangle(600, 300, 26, 26, 0xff4444);
  this.physics.add.existing(zombie);
  zombie.body.setCollideWorldBounds(true);

  // Loot
  loot = this.add.rectangle(450, 200, 18, 18, 0xffcc00);
  this.physics.add.existing(loot);
  loot.body.setImmovable(true);

  // Input
  cursors = this.input.keyboard.createCursorKeys();
  wasd = this.input.keyboard.addKeys("W,A,S,D");

  // Overlap: loot pickup
  this.physics.add.overlap(player, loot, () => {
    loot.destroy();
    infoText.setText("Loot aldın!");
  });

  infoText = this.add.text(16, 16, "WASD: Hareket | Loot'a dokun", { fontSize: "16px", color: "#ddd" });

  // World bounds
  this.physics.world.setBounds(0, 0, 1280, 720);
}

function update() {
  // Player movement
  const speed = 180;
  let vx = 0, vy = 0;
  if (cursors.left.isDown || wasd.A.isDown) vx = -speed;
  else if (cursors.right.isDown || wasd.D.isDown) vx = speed;

  if (cursors.up.isDown || wasd.W.isDown) vy = -speed;
  else if (cursors.down.isDown || wasd.S.isDown) vy = speed;

  player.body.setVelocity(vx, vy);
  player.body.velocity.normalize().scale(speed);

  // Zombie follow (basit)
  const zSpeed = 90;
  const dx = player.x - zombie.x;
  const dy = player.y - zombie.y;
  const len = Math.hypot(dx, dy) || 1;
  zombie.body.setVelocity((dx / len) * zSpeed, (dy / len) * zSpeed);
}
