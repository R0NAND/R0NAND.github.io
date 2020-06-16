var canvas = document.getElementById("introSim");
var ctx = canvas.getContext("2d");
var gravity = 9.8;
var dt = 1 / 60;
var ronan_world = new World(dt);
ronan_world.setGravity(0, gravity);
ronan_world.addBody(new RidgidCircle(3, 5, 75, 150, 10, 0));
ronan_world.addBody(new RidgidCircle(3, 5, 85, 150, -0, 0));
ronan_world.addBody(new RidgidCircle(5, 8, 100, 110, 5, 0));
ronan_world.addBody(new RidgidCircle(1, 3, 115, 110, -5, 0));
ronan_world.addBody(new RidgidCircle(1, 3, 125, 110, 7, -10));
ronan_world.addWall(new Wall(0, 200, 200, 200));
ronan_world.addWall(new Wall(0, 100, 50, 200));
ronan_world.addWall(new Wall(200, 100, 150, 200));
ronan_world.addWall(new Wall(0, 100, 200, 100));

function updateAndDraw(){
  ronan_world.step();
  ronan_world.draw(ctx);
  requestAnimationFrame(updateAndDraw);
}

updateAndDraw();

