var canvas = document.getElementById("fixtureTest");
var ctx = canvas.getContext("2d");

var test_fixture_1 = new Fixture(new CircleShape(0, 0, 10)); 
var test_body_1 = new RigidBody(1, 50, 50, 0, 0, 1, 0, 0);
test_body_1.addFixture(test_fixture_1);

var rhombus_vertices = [[-20, 0], [0, 10], [20, 0], [0, -10]];
var test_fixture_2 = new Fixture(new PolygonShape(rhombus_vertices));
var test_body_2 = new RigidBody(1, 100, 100, 0, 0, 1, 0, 0);
test_body_2.addFixture(test_fixture_2);
var test_fixture_3 = new Fixture(new CircleShape(-20, 0, 10));
test_body_2.addFixture(test_fixture_3);

test_body_1.draw(ctx);
test_body_2.draw(ctx);






