let model;
let colorInput;
let state = 'collecting';
let ele;
let x, y;

function setup() {
  createCanvas(600, 600);
  background(51);
  ele = createP(
    `Select a color and draw on the canvas. After you're done type 't' to train the model.`
  );
  let options = {
    inputs: ['x', 'y'],
    outputs: ['r', 'g', 'b'],
    task: 'regression',
    debug: true
  };
  model = ml5.neuralNetwork(options);
  colorInput = createColorPicker('green');
}

function mouseDragged() {
  if (state == 'collecting') {
    let color = colorInput.color();
    let r = red(color);
    let g = green(color);
    let b = blue(color);
    let inputs = { x: mouseX, y: mouseY };
    let targets = { r, g, b };
    model.addData(inputs, targets);
    noStroke();
    fill(r, g, b);
    ellipse(mouseX, mouseY, 32, 32);
  } else if (state == 'prediction') {
    x = mouseX;
    y = mouseY;
    let xs = { x, y };
    model.predict(xs, gotResults);
  }
}

function keyPressed() {
  if (key == 't') {
    ele.html('Training...');
    model.normalizeData();
    model.train({ epochs: 50 }, finishedTraining);
  }
}

function finishedTraining() {
  ele.html('Finished Training! Now, test the model!');
  state = 'prediction';
}

function gotResults(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  let r = results[0].value;
  let g = results[1].value;
  let b = results[2].value;
  fill(r, g, b);
  noStroke();
  ellipse(x, y, 32, 32);
}
