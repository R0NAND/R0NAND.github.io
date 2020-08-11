var canvas = document.getElementById("introSim");
var ctx = canvas.getContext("2d");
canvas.addEventListener('mousedown', GuiInterface.onClick, false);
canvas.addEventListener('mousemove', GuiInterface.onMove, false);
canvas.addEventListener('mouseup', GuiInterface.onUp, false);
var clicked = false;
var held = false;
var released = false;
var mousePos = new Vec2(0, 0);

var dt = 1 / 60;
var ronan_world = new World(dt);
ronan_world.setGravity(new Vec2(0, 9.8));
var test_fixture_1 = new Fixture(new CircleShape(0, 0, 10), 1, 0.3, 0.5); 
var test_body_1 = new RigidBody(50, 25, 0, 0, 0, 0);
test_body_1.addFixture(test_fixture_1);

var rhombus_vertices = [new Vec2(-20, 0), new Vec2(0, -10), new Vec2(20, 0), new Vec2(0, 10)];
var test_fixture_2 = new Fixture(new PolygonShape(rhombus_vertices), 1, 0.3, 0.5);
var test_body_2 = new RigidBody(50, 125, 4, 4, 2, 0);
test_body_2.addFixture(test_fixture_2);

var test_fixture_3 = new Fixture(new CircleShape(0, 0, 10),  1, 0.3, 0.5); 
var test_body_3 = new RigidBody(150, 25, -4, 4, 0, 0);
test_body_3.addFixture(test_fixture_3);

var triangle_vertices = [new Vec2(0, -20), new Vec2(10, 10), new Vec2(-10, 10)];
var test_fixture_4 = new Fixture(new PolygonShape(triangle_vertices),  1, 0.3, 0.5);
var test_body_4 = new RigidBody(150, 100, -4, 4, 0, 0.1);
test_body_4.addFixture(test_fixture_4);

var box_1_vertices = [new Vec2(-10 + 10, -10 + 10), new Vec2(10 + 10, -10 + 10), new Vec2(10 + 10, 10 + 10), new Vec2(-10 + 10, 10 + 10)];
var box_1_fixture = new Fixture(new PolygonShape(box_1_vertices), 1, 0.3, 0.5);
var box_1 = new RigidBody(35, 75, 0, 0, 0, 1);
box_1.addFixture(box_1_fixture);

var box_2_vertices = [new Vec2(-10, -10), new Vec2(10, -10), new Vec2(10, 10), new Vec2(-10, 10)];
var box_2_fixture = new Fixture(new PolygonShape(box_2_vertices), 1, 0.3, 0.5);
var box_2 = new RigidBody(80, 75, 0, 0, 0, -1);
box_2.addFixture(box_2_fixture);

var box_3_vertices = [new Vec2(-10, -10), new Vec2(10, -10), new Vec2(10, 10), new Vec2(-10, 10)];
var box_3_fixture = new Fixture(new PolygonShape(box_3_vertices), 1, 0.3, 0.5);
var box_3 = new RigidBody(125, 75, 0, 0, 0, 1);
box_3.addFixture(box_3_fixture);

var box_4_vertices = [new Vec2(-10, -10), new Vec2(10, -10), new Vec2(10, 10), new Vec2(-10, 10)];
var box_4_fixture = new Fixture(new PolygonShape(box_4_vertices), 1, 0.3, 0.5);
var box_4 = new RigidBody(170, 75, 0, 0, 0, -1);
box_4.addFixture(box_4_fixture);


var platform_vertices = [new Vec2(90, -10), new Vec2(90, 10), new Vec2(-90, 10), new Vec2(-90, -10)];
var test_platform_fixture = new Fixture(new PolygonShape(platform_vertices), 1, 0.3, 0.5);
var test_platform = new RigidBody(100, 170, 0, 0, 0, 0);
test_platform.addFixture(test_platform_fixture);
test_platform.setStatic();

var left_wall_vertices = [new Vec2(0, 0), new Vec2(10, 0), new Vec2(10, 100), new Vec2(0, 100)];
var left_wall_fixture = new Fixture(new PolygonShape(left_wall_vertices), 1, 0.3, 0.5);
var left_wall = new RigidBody(0, 125, 0, 0, 0, 0);
left_wall.addFixture(left_wall_fixture);
left_wall.setStatic();

var right_wall_vertices = [new Vec2(0, 0), new Vec2(10, 0), new Vec2(10, 100), new Vec2(0, 100)];
var right_wall_fixture = new Fixture(new PolygonShape(right_wall_vertices), 1, 0.3, 0.5);
var right_wall = new RigidBody(200, 125, 0, 0, 0, 0);
right_wall.addFixture(right_wall_fixture);
right_wall.setStatic();

ronan_world.addBody(test_body_1);
ronan_world.addBody(test_body_2);
ronan_world.addBody(test_body_3);
ronan_world.addBody(test_body_4);
ronan_world.addBody(test_platform);
ronan_world.addBody(left_wall);
ronan_world.addBody(right_wall);

ronan_world.addBody(box_1);
ronan_world.addBody(box_2);
ronan_world.addBody(box_3);
ronan_world.addBody(box_4);

var gui_interface = new GuiInterface(ctx, "shape_type", "size", "density", "restitution", "friction", "isStatic");
var gui_spring;

function updateAndDraw(){
  if(clicked == true && held != true && mousePos.x < 50 && mousePos.y < 50){
    var new_body = gui_interface.generateBody();
    ronan_world.addBody(new_body);
    gui_spring = new Spring(new_body, mousePos, null, mousePos, new_body.mass * 10, 2 * Math.sqrt(new_body.mass * new_body.mass * 10));
    ronan_world.addSpring(gui_spring);
    clicked = false;
    held = true;
  }

  if(released == true){
    ronan_world.deleteSpring(gui_spring);
    released = false;
  }

  ronan_world.step();
  ronan_world.draw(ctx);
  gui_interface.drawShape();
  requestAnimationFrame(updateAndDraw);
}

updateAndDraw();

