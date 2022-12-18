var slider_size,
  slider_level,
  slider_rot,
  slider_lenRand,
  slider_branchProb,
  slider_rotRand,
  slider_flowerProb;

var button_seed;

var label_size,
  label_level,
  label_rot,
  label_lenRand,
  label_branchProb,
  label_rotRand,
  label_flowerProb,
  label_source2;

var size, maxLevel, rot, branchProb, rotRand, flowerProb;

var prog = 1,
  growing = false,
  mutating = false,
  randSeed = 80,
  paramSeed = Math.floor(Math.random() * 1000),
  randBias = 0;

var mouseX_,
  mouseY_,
  rotateX_ = 0,
  rotateY_ = 0,
  zoom = 2;

let imgtexture;

function preload() {
  imgtexture = loadImage("img/treetexture.jpg");
  grasstexture = loadImage("img/grasstexture.jpg");
  leaftexture = loadImage("img/leaftexture.jpg");
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight, WEBGL);

  var fov = (60 / 180) * PI;
  var cameraZ = height / 2 / tan(fov / 2);
  perspective((60 / 180) * PI, width / height, cameraZ * 0.001, cameraZ * 100);

  rotateX_ = PI / 8;

  slider_size = createSlider(0, 1, 0.5, 0.01);
  slider_size.position(10, 10);
  slider_level = createSlider(1, 12, 9, 1);
  slider_level.position(10, 40);
  slider_rot = createSlider(0, 1, 0.125, 1 / (3 * 5 * 8));
  slider_rot.position(10, 70);
  slider_lenRand = createSlider(0, 1, 0.5, 0.01);
  slider_lenRand.position(10, 100);
  slider_branchProb = createSlider(0, 1, 0.98, 0.01);
  slider_branchProb.position(10, 130);
  slider_rotRand = createSlider(0, 1, 0.4, 0.01);
  slider_rotRand.position(10, 160);
  slider_flowerProb = createSlider(0, 1, 0.5, 0.01);
  slider_flowerProb.position(10, 190);

  slider_size.input(function () {
    readInputs(true);
  });
  slider_level.input(function () {
    readInputs(true);
  });
  slider_rot.input(function () {
    readInputs(true);
  });
  slider_lenRand.input(function () {
    readInputs(true);
  });
  slider_branchProb.input(function () {
    readInputs(true);
  });
  slider_rotRand.input(function () {
    readInputs(true);
  });
  slider_flowerProb.input(function () {
    readInputs(true);
  });

  label_size = createSpan("Size");
  label_size.position(150, 15);
  label_level = createSpan("Recursion level");
  label_level.position(150, 45);
  label_rot = createSpan("Split angle");
  label_rot.position(150, 75);
  label_lenRand = createSpan("Length variation");
  label_lenRand.position(150, 105);
  label_branchProb = createSpan("Split probability");
  label_branchProb.position(150, 135);
  label_rotRand = createSpan("Split rotation variation");
  label_rotRand.position(150, 165);
  label_flowerProb = createSpan("Flower probability");
  label_flowerProb.position(150, 195);

  button_seed = createButton("Watch it grow!");
  button_seed.position(10, 230);
  button_seed.mousePressed(function () {
    startGrow();
  });

  label_source2 = createA("./index.html", "2D Version");
  label_source2.position(10, 280);

  mouseX_ = mouseX;
  mouseY_ = mouseY;

  readInputs(false);
  startGrow();
}

function mouseDragged() {
  if (mouseX < 330 && mouseY < 400) return true;

  rotateX_ += (mouseY - mouseY_) / 500;
  rotateY_ += (mouseX - mouseX_) / 500;

  mouseX_ = mouseX;
  mouseY_ = mouseY;

  loop();

  return false;
}

function mouseMoved() {
  mouseX_ = mouseX;
  mouseY_ = mouseY;

  if (mouseX > 330 || mouseY > 400) return false;
}

function mouseClicked() {
  if (mouseX > 330 || mouseY > 400) return false;
}

function mouseWheel(event) {
  zoom *= event.delta > 0 ? 1.1 : 1 / 1.1;
  loop();

  return false;
}

function mouseReleased() {
  if (mouseX > 330 || mouseY > 400) return false;
}

function readInputs(updateTree) {
  size = slider_size.value();
  maxLevel = slider_level.value();
  rot = slider_rot.value();
  lenRand = slider_lenRand.value();
  branchProb = slider_branchProb.value();
  rotRand = slider_rotRand.value();
  flowerProb = slider_flowerProb.value();

  if (updateTree && !growing) {
    prog = maxLevel + 1;
    loop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  var fov = (60 / 180) * PI;
  var cameraZ = height / 2 / tan(fov / 2);
  perspective((60 / 180) * PI, width / height, cameraZ * 0.1, cameraZ * 10);

  loop();
}

function draw() {
  background(0, 0, 0);

  scale(1, -1);

  translate(0, -height * (size + 0.25), -zoom * height * size);

  rotate(-rotateX_, [1, 0, 0]);
  rotate(rotateY_, [0, 1, 0]);

  push();
  rotate(-PI / 2, [1, 0, 0]);
  // ambientMaterial(139, 69, 19);
  texture(grasstexture);
  plane(1000, -1000);
  pop();

  ambientLight(255);
  // pointLight(255, 255, 255, 1000, 1000, 1000);

  branch(1, randSeed);

  noLoop();
}

function branch(level, seed) {
  if (prog < level) return;

  randomSeed(seed);

  var seed1 = random(1000),
    seed2 = random(1000);

  var growthLevel = prog - level > 1 || prog >= maxLevel + 1 ? 1 : prog - level;

  var width = 50 * size * Math.pow((maxLevel - level + 1) / maxLevel, 2);
  var len = growthLevel * size * height * (1 + rand2() * lenRand);

  translate(0, len / level / 2, 0);

  // ambientMaterial(139, 69, 19);
  texture(imgtexture);
  box(width, len / level, width);

  translate(0, len / level / 2, 0);

  var doBranch1 = rand() < branchProb;
  var doBranch2 = rand() < branchProb;

  var doFlowers = rand() < flowerProb && prog >= maxLevel && level >= maxLevel;

  if (level < maxLevel) {
    var r11 = rot * PI * (1 + rand2() * rotRand); //+ randWind());
    var r12 = rot * PI * (1 + rand2() * rotRand); // + randWind());
    var r21 = rot * PI * (1 + rand2() * rotRand); //- randWind());
    var r22 = rot * PI * (1 + rand2() * rotRand); //- randWind());

    if (doBranch1) {
      push();
      rotate(PI / 2 + r11, [0, 1, 0]);
      rotate(r12, [1, 0, 0]);
      branch(level + 1, seed1);
      pop();
    }
    if (doBranch2) {
      push();
      rotate(PI / 2 + r21, [0, 1, 0]);
      rotate(-r22, [1, 0, 0]);
      branch(level + 1, seed2);
      pop();
    }
  }

  if (doFlowers) {
    // ambientMaterial(150, 255, 150);
    texture(leaftexture);
    var flowerSize = rand() * growthLevel * size * 50;
    for (var i = 0; i < 4; i++) {
      rotate(PI / 4, [1, 0, 0]);
      rotate((2 * PI * i) / 4, [0, 0, 1]);

      box(2, flowerSize, 2);
    }
  }
}

function startGrow() {
  growing = true;
  prog = 1;
  grow();
}

function grow() {
  if (prog > maxLevel + 3) {
    prog = maxLevel + 3;
    loop();
    growing = false;
    return;
  }

  var startTime = millis();
  loop();
  var diff = millis() - startTime;

  prog += ((maxLevel / 8) * Math.max(diff, 20)) / 1000;
  setTimeout(grow, Math.max(1, 20 - diff));
}

function rand() {
  return random(1000) / 1000;
}

function rand2() {
  return random(2000) / 1000 - 1;
}
