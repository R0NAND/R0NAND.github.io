var canvas = document.getElementById("introSim");
var ctx = canvas.getContext("2d");
var test_tree = new AABBTree();
test_tree.insert(10, 10, 25, 25);
test_tree.insert(110, 110, 135, 135);
test_tree.insert(50, 10, 75, 20);
test_tree.insert(0, 0, 13, 13);
test_tree.insert(90, 60, 110, 70);
test_tree.insert(40, 60, 50, 80);
test_tree.insert(50, 50, 95, 60);
test_tree.draw(ctx, test_tree.root, 0);
console.log(test_tree);
for(var i = 0; i < test_tree.objects.length; i++){
    console.log(test_tree.getCollisionsList(test_tree.objects[i]));
}
test_tree.remove(test_tree.objects[0]);
console.log("bwaaaaaa");
for(var i = 0; i < test_tree.objects.length; i++){
    console.log(test_tree.getCollisionsList(test_tree.objects[i]));
}




