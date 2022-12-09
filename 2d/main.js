var slider_size,
  slider_level,
  slider_rot,
  slider_lenRand,
  slider_branchProb,
  slider_rotRand,
  slider_leafProb;

var label_size,
  label_level,
  label_rot,
  label_lenRand,
  label_branchProb,
  label_rotRand,
  label_leafProb,
  label_seed,
  label_source,
  label_source2;

var div_inputs;

var input_seed, size, maxLevel, rot, lenRan, branchProb, rotRand, leafProb;

var prog = 1,
  growing = false,
  mutating = false,
  randSeed = 80,
  paramSeed = Math.floor(Math.random() * 1000),
  randBias = 0;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  slider_size = createSlider(100, 200, 130, 1);
  slider_size.position(10, 10);
  slider_level = createSlider(1, 20, 11, 1);
  slider_level.position(10, 30);
  slider_rot = createSlider(0, PI / 2, PI / 2 / 4, PI / 2 / (3 * 5 * 8));
  slider_rot.position(10, 50);
  slider_lenRand = createSlider(0, 1, 1, 0.01);
  slider_lenRand.position(10, 70);
  slider_branchProb = createSlider(0, 2, 1, 0.01);
  slider_branchProb.position(10, 90);
  slider_rotRand = createSlider(0, 1, 0.1, 0.01);
  slider_rotRand.position(10, 110);
  slider_leafProb = createSlider(0, 1, 0.5, 0.01);
  slider_leafProb.position(10, 130);

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
  slider_leafProb.input(function () {
    readInputs(true);
  });

  label_size = createSpan("Size");
  label_size.position(150, 10);
  label_level = createSpan("Recursion level");
  label_level.position(150, 30);
  label_rot = createSpan("Split angle");
  label_rot.position(150, 50);
  label_lenRand = createSpan("Length variation");
  label_lenRand.position(150, 70);
  label_branchProb = createSpan("Split probability");
  label_branchProb.position(150, 90);
  label_rotRand = createSpan("Split rotation variation");
  label_rotRand.position(150, 110);
  label_leafProb = createSpan("Flower probability");
  label_leafProb.position(150, 130);

  button_seed = createButton("Watch it grow!");
  button_seed.position(10, 160);
  button_seed.mousePressed(function () {
    startGrow();
  });

  div_inputs = createDiv("");

  readInputs(false);
  startGrow();
}

function showUI() {
  slider_size.style("visibility", "initial");
  slider_level.style("visibility", "initial");
  slider_rot.style("visibility", "initial");
  slider_lenRand.style("visibility", "initial");
  slider_branchProb.style("visibility", "initial");
  slider_rotRand.style("visibility", "initial");
  slider_leafProb.style("visibility", "initial");

  button_seed.style("visibility", "initial");

  label_size.style("visibility", "initial");
  label_level.style("visibility", "initial");
  label_rot.style("visibility", "initial");
  label_lenRand.style("visibility", "initial");
  label_branchProb.style("visibility", "initial");
  label_rotRand.style("visibility", "initial");
  label_leafProb.style("visibility", "initial");
}

function readInputs(updateTree) {
  size = slider_size.value();
  maxLevel = slider_level.value();
  rot = slider_rot.value();
  lenRand = slider_lenRand.value();
  branchProb = slider_branchProb.value();
  rotRand = slider_rotRand.value();
  leafProb = slider_leafProb.value();

  if (updateTree && !growing) {
    prog = maxLevel + 1;
    loop();
  }
}

function mutate() {
  if (!mutating) return;

  var startTime = millis();
  randomSeed(paramSeed);

  var n = noise(startTime / 20000) - 0.5;

  randBias = 4 * Math.abs(n) * n;

  paramSeed = 1000 * random();
  randomSeed(randSeed);
  readInputs(true);

  var diff = millis() - startTime;

  if (diff < 20) setTimeout(mutate, 20 - diff);
  else setTimeout(mutate, 1);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  stroke(Math.random() * 255, Math.random() * 255, Math.random() * 255);

  background(0, 0, 0);
  translate(width / 2, height);
  scale(1, -1);

  translate(0, 20);

  branch(1, randSeed);

  noLoop();
}

function branch(level, seed) {
  if (prog < level) return;

  randomSeed(seed);

  var seed1 = random(1000),
    seed2 = random(1000);

  var growthLevel = prog - level > 1 || prog >= maxLevel + 1 ? 1 : prog - level;

  strokeWeight(12 * Math.pow((maxLevel - level + 1) / maxLevel, 2));

  var len = growthLevel * size * (1 + rand2() * lenRand);

  line(0, 0, 0, len / level);
  translate(0, len / level);

  var doBranch1 = rand() < branchProb;
  var doBranch2 = rand() < branchProb;

  var doLeaves = rand() < leafProb;

  if (level < maxLevel) {
    var r1 = rot * (1 + rrand() * rotRand);
    var r2 = -rot * (1 - rrand() * rotRand);

    if (doBranch1) {
      push();
      rotate(r1);
      branch(level + 1, seed1);
      pop();
    }
    if (doBranch2) {
      push();
      rotate(r2);
      branch(level + 1, seed2);
      pop();
    }
  }

  if ((level >= maxLevel || (!doBranch1 && !doBranch2)) && doLeaves) {
    var p = Math.min(1, Math.max(0, prog - level));

    var flowerSize = (size / 100) * p * (1 / 6) * (len / level);

    strokeWeight(3);
    stroke(Math.random() * 255, Math.random() * 255, Math.random() * 255);

    rotate(-PI);
    for (var i = 0; i <= 8; i++) {
      line(0, 1, 0, flowerSize * (1 + 0.5 * rand2()));
      rotate((2 * PI) / 8);
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

function rrand() {
  return rand2() + randBias;
}
