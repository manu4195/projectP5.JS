let mic, fft;
let stars = [];
let planets = [];
let bgGradient;

function setup() {
  createCanvas(windowWidth, windowHeight);
  userStartAudio(); // Activate microphone input
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT(0.9, 64);
  fft.setInput(mic);

  // Initialize stars
  for (let i = 0; i < 100; i++) {
    stars.push(new Star());
  }

  // Initialize planets
  for (let i = 0; i < 100; i++) {
    planets.push(new Planet());
  }

  // Create the background gradient
  bgGradient = createGraphics(windowWidth, windowHeight);
  bgGradient.noFill();
  for (let y = 0; y <= height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(20, 20, 50), color(0, 0, 0), inter);
    bgGradient.stroke(c);
    bgGradient.line(0, y, width, y);
  }
}

function draw() {
  image(bgGradient, 0, 0); // Draw the background gradient
  drawSpaceBackground(); // Starry background
  drawCircularEqualizer(); // Circular equalizer
  drawPlanets(); // Planets orbiting
}

function drawSpaceBackground() {
  for (let star of stars) {
    star.update();
    star.show();
  }
}

function drawCircularEqualizer() {
  push();
  translate(mouseX, mouseY); // Follow the mouse
  let spectrum = fft.analyze();
  noFill();

  for (let i = 0; i < spectrum.length; i++) {
    let angle = map(i, 0, spectrum.length, 0, TWO_PI);
    let amp = spectrum[i];
    let rStart = 100;
    let rEnd = map(amp, 0, 255, 100, 400);

    let xStart = rStart * cos(angle);
    let yStart = rStart * sin(angle);
    let xEnd = rEnd * cos(angle);
    let yEnd = rEnd * sin(angle);

    let alpha = map(amp, 0, 255, 50, 255);
    stroke(i * 4, 255 - i * 4, 200, alpha);
    strokeWeight(6);
    line(xStart, yStart, xEnd, yEnd);
  }
  pop();
}

class Star {
  constructor() {
    this.reset();
    this.history = [];
  }

  reset() {
    this.x = random(-width, width / 2);
    this.y = random(-height, height / 2);
    this.size = random(5, 7);
    this.speedX = random(2, 5);
    this.speedY = random(2, 5);
    this.history = [];
  }

  update() {
    this.history.push({ x: this.x, y: this.y });
    if (this.history.length > 10) {
      this.history.shift();
    }
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.y > height || this.x > width) {
      this.reset();
    }
  }

  show() {
    noStroke();
    beginShape();
    for (let i = 0; i < this.history.length; i++) {
      let pos = this.history[i];
      let alpha = map(i, 0, this.history.length, 0, 255);
      fill(255 * cos(i * 0.1), 255 * sin(i * 0.1), 255 - i * 10, alpha);
      ellipse(pos.x, pos.y, this.size, this.size);
    }
    endShape();
  }
}

class Planet {
  constructor() {
    this.angle = random(TWO_PI);
    this.radius = random(150, 300);
    this.size = random(20, 50);
    this.speed = random(0.01, 0.03);
    this.color = color(random(100, 255), random(100, 255), random(100, 255)); // Random color for each planet
    this.hasRing = random(1) > 0.5; // Randomly decide if the planet has a ring
    this.direction = random(1) > 0.5 ? 0.5 : -1; // Randomly set the direction to 0.5 (clockwise) or -0.5 (counterclockwise)
  }

  update() {
    this.angle += this.speed * this.direction; // Update the angle based on the direction
  }

  show() {
    // Position of the planet relative to the equalizer center
    let x = this.radius * cos(this.angle);
    let y = this.radius * sin(this.angle);

    fill(this.color);
    noStroke();
    ellipse(mouseX + x, mouseY + y, this.size);

    if (this.hasRing) {
      stroke(255);
      noFill();
      ellipse(mouseX + x, mouseY + y, this.size * 1.5, this.size * 0.5); // Draw a ring around the planet
    }
  }
}

function drawPlanets() {
  for (let planet of planets) {
    planet.update();
    planet.show();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
































