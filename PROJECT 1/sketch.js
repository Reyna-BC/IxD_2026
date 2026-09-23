// ============== VARIABLES ================
let packImage;
let commonImg;
let rareImg;
let epicImg;
let legendaryImg;
let backgroundImage;

let state = "pack";
let cards = [];
let revealedCards = [];
let currentCard = 0;

let cardX;
let cardY;

let cardRotation = 0;

let flyingAway = false;
let flySpeed = 0;
let revealDistance = 200;

const CARD_W = 220;
const CARD_H = 320;

const cardPool = {
  Common: ["images/common.png"],
  Rare: ["images/rare.png"],
  Epic: ["images/epic.png"],
  Legendary: ["images/legendary.png"],
};
// =============== IMAGES OF CARDS ======================
function preload() {
  backgroundImage = loadImage("backgroundimage.png");
  commonImg = loadImage("images/common.png");
  rareImg = loadImage("images/rare.png");
  epicImg = loadImage("images/epic.png");
  legendaryImg = loadImage("images/legendary.png");
  packImage = loadImage("images/pack.png");
}

// ======= OPENING BEGINNING SCREEN ==========
function setup() {
  createCanvas(940, 600);

  textAlign(CENTER, CENTER);

  cardX = width / 2;
  cardY = height / 2;
}

//======= CARDS STATES =======
function draw() {
  image(backgroundImage, 0, 0, width, height);
  updateFlyingCard();
  if (state === "pack") {
    drawPack();
  }
  if (state === "reveal") {
    revealCards();
  }
}

// ======= TEXTS n PULSE ANIMATION =========
function drawPack() {
  push();

  translate(width / 2, height / 2);
  let pulse = sin(frameCount * 0.1) * 10;

  imageMode(CENTER);
  image(packImage, 0, 0, 300 + pulse, 420 + pulse);

  pop();

  fill(255);
  textSize(20);
  text("Click Pack", width / 2, height - 50);
}

//======= OPENING PACK ===========
function mousePressed() {
  if (state !== "pack") return;

  let packWidth = 220;
  let packHeight = 320;

  let left = width / 2 - packWidth / 2;
  let right = width / 2 + packWidth / 2;

  let top = height / 2 - packHeight / 2;
  let bottom = height / 2 + packHeight / 2;

  if (mouseX >= left && mouseX <= right && mouseY >= top && mouseY <= bottom) {
    openPack();

    state = "reveal";
  }
}
// ====== RESET PACKS =======
function keyPressed() {
  if (key === " ") {
    state = "pack";

    cards = [];
    revealedCards = [];

    currentCard = 0;

    cardX = width / 2;
    cardY = height / 2;

    cardRotation = 0;
  }
}
// ========== NUMBER OF CARDS IN PACKS ========
function openPack() {
  cards = [];

  for (let i = 0; i < 5; i++) {
    cards.push(generateCard());
  }

  currentCard = 0;

  cardX = width / 2;
  cardY = height / 2;

  cardRotation = 0;
}
// =========== CARD GENTERATOR ==================
function generateCard() {
  let roll = random(100);

  if (roll < 1) {
    return {
      rarity: "", image: legendaryImg
    }
  }

  if (roll < 15) {
    return {
      rarity: "", image: epicImg
    }
  }

  if (roll < 35) {
    return {
      rarity: "", image: rareImg
    }
  }

  return {
    rarity: "",
    image: commonImg
  }
}
// ======  REVEALING CARDS AT THE END =======
function revealCards() {
  if (currentCard < cards.length) {
    drawSingleCard(cards[currentCard]);
  } else {
    drawFinalSpread();
  }
}
// ======= ROTATION ON CARD ==========
function drawSingleCard(card) {
  push();

  translate(cardX, cardY);

  rotate(radians(cardRotation));
  applyRarityGlow(card.rarity);
  
//======= CARD TURNAROUND ANIMATION (lesser number = animation turned card)======
  let revealAmount = map(cardX,width / 0, width / 0 + revealDistance,0,1,true);

  let scaleX = abs(cos(revealAmount * PI));

  scale(scaleX, 1);

  rectMode(CENTER);

  if (revealAmount < 0.5) {
    fill(0);
    rect(0, 0, CARD_W, CARD_H, 20);
  } else {
    fill(255);
    rect(0, 0, CARD_W, CARD_H, 20);
    if (card.image) {
      imageMode(CENTER);
      image(card.image, 0, 0, 250, 350);
    }
    textSize(22);

    text(card.rarity, 0, 50);
  }

  pop();

  stroke(255, 255, 0);

//============= LINE WHERE IT THROWS AWAY CARD =============================
  noStroke();
  fill(255);
  textSize(20);

  text("Drag card to the right", width / 2, 520);
}
//================ MOUSE FUNCTIONS and FLYING ANIMATION ==================
function mouseDragged() {
  if (state === "reveal" && currentCard < cards.length && !flyingAway) {
    cardX = mouseX;
    cardY = mouseY;

    cardRotation = (mouseX - width / 2) * 0.05;
  }
}

function mouseReleased() {
  if (state === "reveal" && currentCard < cards.length) {
    if (cardX > width / 2 + revealDistance) {
      flyingAway = true;

      flySpeed = 20;
    } else {
      cardX = width / 2;
      cardY = height / 2;

      cardRotation = 0;
    }
  }
}

//====== THROWING CARD ANIMATION =======
function updateFlyingCard() {
  if (!flyingAway) return;

  cardX += flySpeed;

  flySpeed += 1;

  cardRotation += 4;

  if (cardX > width + 300) {
    revealedCards.push(cards[currentCard]);

    currentCard++;

    cardX = width / 2;
    cardY = height / 2;

    cardRotation = 0;

    flyingAway = false;
  }
}
//===== ALL CARDS REVEALED SETUP =======
function drawFinalSpread() {
  let startX = 120;

  for (let i = 0; i < revealedCards.length; i++) {
    let card = revealedCards[i];

    push();

    translate(startX + i * 170, 300);
    applyRarityGlow(card.rarity);

    fill(255);
    rectMode(CENTER);
    rect(0, 0, 140, 220, 15);

    if (card.image) {
      imageMode(CENTER);
      image(card.image, 0, -25, 250, 300);
    }

    fill(0);

    textSize(12);
    text(card.rarity, 0, 75);

    pop();
  }

  fill(244);
  textSize(50);
  text("Press SPACE for another pack.", width / 2, 550);
}

// ====== GLOW FOR RARITY ==========
function applyRarityGlow(rarity) {
  drawingContext.shadowBlur = 0;

  if (rarity === "rare.png") {
    drawingContext.shadowBlur = 100;
    drawingContext.shadowColor = "blue";
  }

  if (rarity === "epic.png") {
    drawingContext.shadowBlur = 100;
    drawingContext.shadowColor = "purple";
  }

  if (rarity === "legendary.png") {
    let hue = frameCount % 360;

    drawingContext.shadowBlur = 100;
    drawingContext.shadowColor = `hsl(${hue},100%,50%)`;
  }
}
