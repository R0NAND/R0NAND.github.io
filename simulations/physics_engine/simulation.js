var canvas = document.getElementById("introSim");
var ctx = canvas.getContext("2d");
var gravity = 9.8;
var dt = 1 / 60;
var ronan_world = new World(dt);
ronan_world.setGravity(0, gravity);
ronan_world.addBody(new RidgidCircle(3, 8, 40, 110, 0, 0));
ronan_world.addBody(new RidgidCircle(3, 8, 60, 110, 0, 0));
ronan_world.addBody(new RidgidCircle(3, 8, 80, 110, 0, 0));
ronan_world.addBody(new RidgidCircle(3, 8, 100, 110, 0, 0));
ronan_world.addBody(new RidgidCircle(3, 8, 120, 110, 0, 0));
ronan_world.addBody(new RidgidCircle(3, 8, 140, 110, 0, 0));
ronan_world.addBody(new RidgidCircle(3, 8, 160, 110, 0, 0));
ronan_world.addBody(new RidgidCircle(3, 8, 50, 130, 0, 0));
ronan_world.addBody(new RidgidCircle(3, 8, 70, 130, 0, 0));
ronan_world.addBody(new RidgidCircle(3, 8, 90, 130, 0, 0));
ronan_world.addBody(new RidgidCircle(3, 8, 110, 130, 0, 0));
ronan_world.addBody(new RidgidCircle(3, 8, 130, 130, 0, 0));
ronan_world.addBody(new RidgidCircle(3, 8, 150, 130, 0, 0));
ronan_world.addBody(new RidgidCircle(3, 8, 60, 150, 0, 0));
ronan_world.addBody(new RidgidCircle(3, 8, 80, 150, 0, 0));
ronan_world.addBody(new RidgidCircle(3, 8, 100, 150, 0, 0));
ronan_world.addBody(new RidgidCircle(3, 8, 120, 150, 0, 0));
ronan_world.addBody(new RidgidCircle(3, 8, 140, 150, 0, 0));
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

