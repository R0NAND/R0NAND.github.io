var canvas = document.getElementById("introSim");
var ctx = canvas.getContext("2d");
var gravity = 9.8;
var dt = 1 / 60;
var ronan_world = new World(dt);
ronan_world.setGravity(0, gravity);
var test_fixture_1 = new Fixture(new CircleShape(0, 0, 10), 1, 0.1, 1); 
var test_body_1 = new RigidBody(50, 25, 4, 4, 0, 0);
test_body_1.addFixture(test_fixture_1);

var rhombus_vertices = [[-20, 0], [0, -10], [20, 0], [0, 10]];
var test_fixture_2 = new Fixture(new PolygonShape(rhombus_vertices), 1, 0.1, 1);
var test_body_2 = new RigidBody(50, 125, 4, 4, 2, 0);
test_body_2.addFixture(test_fixture_2);

var test_fixture_3 = new Fixture(new CircleShape(0, 0, 10),  1, 0.1, 1); 
var test_body_3 = new RigidBody(150, 25, -4, 4, 0, 0);
test_body_3.addFixture(test_fixture_3);

var triangle_vertices = [[0, -20], [10, 10], [-10, 10]];
var test_fixture_4 = new Fixture(new PolygonShape(triangle_vertices),  1, 0.1, 1);
var test_body_4 = new RigidBody(150, 100, -4, 4, 0, 0.1);
test_body_4.addFixture(test_fixture_4);


var platform_vertices = [[90, -10], [90, 10], [-90, 10], [-90, -10]];
var test_platform_fixture = new Fixture(new PolygonShape(platform_vertices), 1, 0.1, 1);
var test_platform = new RigidBody(100, 170, 0, 0, 0, 0);
test_platform.addFixture(test_platform_fixture);
test_platform.setStatic();

ronan_world.addBody(test_body_1);
ronan_world.addBody(test_body_2);
ronan_world.addBody(test_body_3);
ronan_world.addBody(test_body_4);
ronan_world.addBody(test_platform);

function updateAndDraw(){
  ronan_world.step();
  ronan_world.draw(ctx);
  requestAnimationFrame(updateAndDraw);
}

updateAndDraw();

