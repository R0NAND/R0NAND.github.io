var canvas = document.getElementById("introSim");
var ctx = canvas.getContext("2d");
var test_tree = new AABBTree();
test_tree.insert(10, 10, 100, 100);
test_tree.insert(15, 15, 35, 35);
test_tree.draw(ctx);
