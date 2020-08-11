var canvas = document.getElementById("introSim");
var ctx = canvas.getContext("2d");
var test_tree = new AABBTree();
test_tree.insert(new AABB(new Vec2(10, 10), new Vec2(25, 25)));
test_tree.insert(new AABB(new Vec2(110, 110), new Vec2(135, 135)));
test_tree.insert(new AABB(new Vec2(50, 10), new Vec2(75, 20)));
test_tree.insert(new AABB(new Vec2(0, 0), new Vec2(13, 13)));
test_tree.insert(new AABB(new Vec2(90, 60), new Vec2(110, 70)));
test_tree.insert(new AABB(new Vec2(40, 60), new Vec2(50, 80)));
test_tree.insert(new AABB(new Vec2(50, 50), new Vec2(95, 60)));
console.log(test_tree);
for(var i = 0; i < test_tree.objects.length; i++){
    console.log(test_tree.getCollisionsList(test_tree.objects[i]));
}
test_tree.remove(test_tree.objects[0]);
console.log("bwaaaaaa");
test_tree.draw(ctx, test_tree.root, 0);
for(var i = 0; i < test_tree.objects.length; i++){
    console.log(test_tree.getCollisionsList(test_tree.objects[i]));
}





