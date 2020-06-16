var canvas = document.getElementById("waveSim");
var ctx = canvas.getContext("2d");

test_wave = new Aether(100, 100);
function updateAndDraw(){
  test_wave.step();
  test_wave.draw();
  requestAnimationFrame(updateAndDraw);
}

updateAndDraw();