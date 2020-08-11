// RENAME FILE
class AABB{
  constructor(min, max){
    this.min = min;
    this.max = max;
  }
  doesItFit(aabb){
    return (this.min.x < aabb.min.x && this.max.x > aabb.max.x && this.min.y < aabb.min.y && this.max.y > aabb.max.y);
  }

  fatten(fatness){
    this.min = Vec2.subtract(this.min, new Vec2(fatness, fatness));
    this.max = Vec2.add(this.max, new Vec2(fatness, fatness));
  }

  static doTheyCollide(aabb_1, aabb_2){
    return (aabb_1.max.x > aabb_2.min.x && aabb_1.min.x < aabb_2.max.x && aabb_1.max.y > aabb_2.min.y && aabb_1.min.y < aabb_2.max.y);
  }
}

class AABBNode extends AABB{
  constructor(min, max, parent){
    super(min, max);
    this.min = min;
    this.max = max;
    this.parent = parent;
  }

  getNewArea(aabb){
    return (Math.max(this.max.x, aabb.max.x) - Math.min(this.min.x, aabb.min.x)) * (Math.max(this.max.y, aabb.max.y) - Math.min(this.min.y, aabb.min.y));
  }

  resize(){
    this.min.x = Math.min(this.right_child.min.x, this.left_child.min.x);
    this.min.y = Math.min(this.right_child.min.y, this.left_child.min.y);
    this.max.x = Math.max(this.right_child.max.x, this.left_child.max.x);
    this.max.y = Math.max(this.right_child.max.y, this.left_child.max.y);
  }
}

class AABBBranch extends AABBNode{
  constructor(min, max, parent, left_child, right_child){
    super(min, max, parent);
    this.left_child = left_child;
    this.right_child = right_child;
    this.resize();
  }
}

class AABBLeaf extends AABBNode{
  constructor(min, max, parent, object){
    super(min, max, parent);
    this.object = object;
    this.explored = false;
  }
}