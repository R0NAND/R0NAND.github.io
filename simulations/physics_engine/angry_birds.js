var canvas = document.getElementById("demo");
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


var platform_vertices = [new Vec2(300, -50), new Vec2(300, 50), new Vec2(-300, 50), new Vec2(-300, -50)];
var test_platform_fixture = new Fixture(new PolygonShape(platform_vertices), 1, 0.3, 0.5);
var test_platform = new RigidBody(400, 300, 0, 0, 0, 0);
test_platform.addFixture(test_platform_fixture);
test_platform.setStatic();

ronan_world.addBody(test_platform);

var vplank_vertices = [new Vec2(10, -30), new Vec2(10, 30), new Vec2(-10, 30), new Vec2(-10, -30)];
var hplank_vertices = [new Vec2(30, -10), new Vec2(30, 10), new Vec2(-30, 10), new Vec2(-30, -10)];

var first_support_1_fixture = new Fixture(new PolygonShape(vplank_vertices), 2, 0.5, 0);
var first_support_2_fixture = new Fixture(new PolygonShape(vplank_vertices), 2, 0.5, 0);
var first_support_3_fixture = new Fixture(new PolygonShape(vplank_vertices), 2, 0.5, 0);
var first_support_4_fixture = new Fixture(new PolygonShape(vplank_vertices), 2, 0.5, 0);
var first_support_1 = new RigidBody(400, 220, 0, 0, 0, 0);
var first_support_2 = new RigidBody(450, 220, 0, 0, 0, 0);
var first_support_3 = new RigidBody(510, 220, 0, 0, 0, 0);
var first_support_4 = new RigidBody(560, 220, 0, 0, 0, 0);
first_support_1.addFixture(first_support_1_fixture);
first_support_2.addFixture(first_support_2_fixture);
first_support_3.addFixture(first_support_3_fixture);
first_support_4.addFixture(first_support_4_fixture);
ronan_world.addBody(first_support_1);
ronan_world.addBody(first_support_2);
ronan_world.addBody(first_support_3);
ronan_world.addBody(first_support_4);

var first_platform_1_fixture = new Fixture(new PolygonShape(hplank_vertices), 1, 0.5, 0);
var first_platform_2_fixture = new Fixture(new PolygonShape(hplank_vertices), 1, 0.5, 0);
var first_platform_3_fixture = new Fixture(new PolygonShape(hplank_vertices), 1, 0.5, 0);
var first_platform_1 = new RigidBody(420, 174, 0, 0, 0, 0);
var first_platform_2 = new RigidBody(480.1, 174, 0, 0, 0, 0);
var first_platform_3 = new RigidBody(540.2, 174, 0, 0, 0, 0);
first_platform_1.addFixture(first_platform_1_fixture);
first_platform_2.addFixture(first_platform_2_fixture);
first_platform_3.addFixture(first_platform_3_fixture);
ronan_world.addBody(first_platform_1);
ronan_world.addBody(first_platform_2);
ronan_world.addBody(first_platform_3);

var second_support_1_fixture = new Fixture(new PolygonShape(vplank_vertices), 1, 0.5, 0);
var second_support_2_fixture = new Fixture(new PolygonShape(vplank_vertices), 1, 0.5, 0);
var second_support_3_fixture = new Fixture(new PolygonShape(vplank_vertices), 1, 0.5, 0);
var second_support_1 = new RigidBody(430, 140, 0, 0, 0, 0);
var second_support_2 = new RigidBody(480, 140, 0, 0, 0, 0);
var second_support_3 = new RigidBody(530, 140, 0, 0, 0, 0);
second_support_1.addFixture(second_support_1_fixture);
second_support_2.addFixture(second_support_2_fixture);
second_support_3.addFixture(second_support_3_fixture);
ronan_world.addBody(second_support_1);
ronan_world.addBody(second_support_2);
ronan_world.addBody(second_support_3);

var second_platform_1_fixture = new Fixture(new PolygonShape(hplank_vertices), 1, 0.5, 0);
var second_platform_2_fixture = new Fixture(new PolygonShape(hplank_vertices), 1, 0.5, 0);
var second_platform_1 = new RigidBody(450, 95, 0, 0, 0, 0);
var second_platform_2 = new RigidBody(510.1, 95, 0, 0, 0, 0);
second_platform_1.addFixture(second_platform_1_fixture);
second_platform_2.addFixture(second_platform_2_fixture);
ronan_world.addBody(second_platform_1);
ronan_world.addBody(second_platform_2);

var third_support_1_fixture = new Fixture(new PolygonShape(vplank_vertices), 1, 0.5, 0);
var third_support_2_fixture = new Fixture(new PolygonShape(vplank_vertices), 1, 0.5, 0);
var third_support_1 = new RigidBody(460, 65, 0, 0, 0, 0);
var third_support_2 = new RigidBody(510, 65, 0, 0, 0, 0);
third_support_1.addFixture(third_support_1_fixture);
third_support_2.addFixture(third_support_2_fixture);
ronan_world.addBody(third_support_1);
ronan_world.addBody(third_support_2);

var roof_vertices = [new Vec2(35, 10), new Vec2(-35, 10), new Vec2(0, -10)];
var third_platform_1_fixture = new Fixture(new PolygonShape(roof_vertices), 1, 0.5, 0);
var third_platform_1 = new RigidBody(485, 20, 0, 0, 0, 0);
third_platform_1.addFixture(third_platform_1_fixture);
ronan_world.addBody(third_platform_1);



var gui_interface = new GuiInterface(ctx, "shape_type", "size", "density", "restitution", "friction", "isStatic");
var gui_spring;

function updateAndDraw(){
  if(clicked == true && held != true && Math.sqrt(Math.pow(mousePos.x - 125, 2) + Math.pow(mousePos.y - 200, 2)) < 15){
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

