var colorPicker;
var numberInput;
var color;
var network = new brain.NeuralNetwork();
var generativeNetwork = new brain.NeuralNetwork();
var trainingData = [];
var invertedTrainingData = [];

//START
window.onload = function () {

  //NEURAL NETWORK
  network = new brain.NeuralNetwork();

  //SET TRAINING DATA
  for (var i = 0; i < 100; i++) {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);

    var inColor = (r + g + b) / (255 * 3);
    var colorDarkness = (0.2126 * r + 0.7152 * g + 0.0722 * b) < (255 / 2) ? 0 : 1;

    trainingData.push({
      input: [inColor]
      ,
      output: [colorDarkness]
    });

    invertedTrainingData.push({
      input: [colorDarkness]
      ,
      output: [inColor]
    });
  }

  //TRAIN THE NETWORK
  network.train(trainingData);
  generativeNetwork.train(invertedTrainingData);

  //VARIABLE Y LISTENER
  colorPicker = document.getElementById("colorInput");
  numberInput = document.getElementById("numberInput");
  colorPicker.addEventListener("input", function () {
    //OUTPUT COLOR
    setOutputColor();
  }, false);

  setOutputColor();
};

function setOutputColor() {
  color = colorPicker.value;
  var r = parseInt(color.substr(1, 2), 16);
  var g = parseInt(color.substr(3, 2), 16);
  var b = parseInt(color.substr(5, 2), 16);

  //SET UI
  document.getElementById("outputText").innerHTML = "R: " + r + "<br>" + "G: " + g + "<br>" + "B: " + b;
  document.getElementById("labelColor").innerHTML = colorPicker.value;
  document.getElementById("luminanceText").innerHTML = (0.2126 * r + 0.7152 * g + 0.0722 * b);
  document.getElementById("outputNNText").innerHTML = (network.run([(r + g + b) / (255 * 3)]) < (0.5) ? "Oscuro " : "Claro ") + network.run([(r + g + b) / (255 * 3)]);
  document.getElementById("colorSVG").style.fill = rgbToHex(r, g, b);

  //PRPBABILITY TO COLOR
  var colorNumber = Math.round(generativeNetwork.run([numberInput.value]) * (255 * 3));
  r = Math.floor(Math.random() * (colorNumber / 2));
  colorNumber -= r;
  g = Math.floor(Math.random() * (colorNumber / 2));
  b = Math.floor(colorNumber);
  //RANDOM SWAP
  (Math.round(Math.random()) == 0)[r, g, b] = [g, r, b];
  (Math.round(Math.random()) == 0)[r, g, b] = [r, b, g];
  document.getElementById("generatedColorSVG").style.fill = rgbToHex(r, g, b);
}

function rgbToHex(red, green, blue) {
  const rgb = (red << 16) | (green << 8) | (blue << 0);
  return '#' + (0x1000000 + rgb).toString(16).slice(1);
}