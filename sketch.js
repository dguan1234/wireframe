var ground;
var sky;
var movingBackground;
var bussin;
var bozo;
var potholeImage;
var potholesGroup;
var GROUND_Y = 200;
var GRAVITY = 1;
var JUMP = 20;
var x1 = 0;
var x2;
let gameState = 'start';
let scrollSpeed;
let score = 0;

function preload() {
  potholeImage = loadImage("assets/pothole0001.png")
  movingBackground = loadImage("assets/ground.png")
  bussin = loadAnimation("assets/bus0001.png", "assets/bus0002.png")
  startMenu = loadImage("assets/gamestart.png")
  endMenu = loadImage("assets/gameend.png")
  selectMenu = loadImage("assets/game-shoeselect.png")
}

function setup() {
  createCanvas(1000, 500);
  bozo = createSprite(100, 400);
  bozo.addAnimation('running', 'assets/running0001.png', 'assets/running0002.png');
  bozo.addAnimation('jumping', 'assets/jumping0001.png');
  bozo.setCollider('rectangle', 0, 0, 100, 150);
  ground = createSprite(100, 450);
  ground.addAnimation('normal', 'assets/small_platform0001.png', 'assets/small_platform0003.png');
  sky = createSprite(100, 35)
  sky.addAnimation('normal', 'assets/skybox0001.png', 'assets/skybox0002.png');
  sky.setCollider('rectangle', 0, 0, 200, 30);
  potholesGroup = new Group();
  score = 0
  x2 = width
}

function draw() {
  switch (gameState) {
    case 'start':
      gameStart()
      break;
    case 'selection':
      gameSelection()
      break;
    case 'play':
      gamePlay()
      break;
    case 'end':
      gameEnd()
      break;
  }
}

function keyPressed() {
 if (gameState === 'selection' || gameState === 'end') {
    if (key === 'G' || key === 'g') {
      gameState = 'play';
      bozo.position.x = 100
      bozo.position.y = 400
      score = 0
    }
} else if (gameState === 'start'){
  if (key === 'G' || key === 'g'){
    gameState = 'selection';
  }
}

}

function backgroundMoving() {
  scrollSpeed = (10 + 3 * score / 100)
  image(movingBackground, x1, 0, width + 9, height);
  image(movingBackground, x2, 0, width + 9, height);
  x1 -= scrollSpeed;
  x2 -= scrollSpeed;
  if (x1 < -width) {
    x1 = width;
  }
  if (x2 < -width) {
    x2 = width;
  }
}

function gameStart() {
  image(startMenu, 0, 0)
  scale(100);
}

function gameSelection() {
  image(selectMenu, 0, 0)
  scale(100);
}

function gamePlay() {
  backgroundMoving()
  score = score + Math.round(getFrameRate() / 60);
  animation(bussin, 850, 175)
  bozo.collide(sky)
  bozo.velocity.y += GRAVITY;
  if (bozo.collide(ground)) {
    bozo.velocity.y = 0;
    bozo.changeAnimation('running');
  }
  if (mouseWentDown(LEFT)) {
    jump()
  }
  drawSprites();
  for (var i = 0; i < potholesGroup.length; i++)
    if (potholesGroup[i].position.x < bozo.position.x - width / 2) {
      potholesGroup[i].remove()
    }
  if (bozo.overlap(potholesGroup)) {
    gameEnd()
  }
  spawnPotholes()
  push()
  textSize(20)
  fill(255, 255, 255)
  text("Score: " + score, 30, 50);
  pop()
}

function spawnPotholes() {
  if (frameCount % 60 === 0) {
    var potholes = createSprite(1000, 415, 20, 30);
    potholes.setCollider('circle', 0, 0, 45)
    potholes.addImage(potholeImage);
    potholes.lifetime = 300;
    potholesGroup.add(potholes);
    potholes.velocity.x = -(10 + 3 * score / 100);
  }
}

function gameEnd() {
  gameState = 'end'
  image(endMenu, 0, 0)
  push()
  fill(8, 255, 69)
  textSize(30)
  text("your score was: " + score, 150, 360)
  pop()
  potholesGroup.removeSprites()
  scrollSpeed = score
}

function jump() {
  if (bozo.position.y >= 338.5) {
    bozo.changeAnimation("jumping");
    bozo.animation.rewind();
    bozo.velocity.y = -JUMP;
  }
}
