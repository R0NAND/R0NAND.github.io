class AABBNode{
  constructor(min_x, min_y, max_x, max_y, parent){
    this.min_x = min_x;
    this.min_y = min_y;
    this.max_x = max_x;
    this.max_y = max_y;
    this.parent = parent;
  }

  getNewArea(aabb){
    return (Math.max(this.max_x, aabb.max_x) - Math.min(this.min_x, aabb.min_x)) * (Math.max(this.max_y, aabb.max_y) - Math.min(this.min_y, aabb.min_y));
  }

  resize(){
    this.min_x = Math.min(this.right_child.min_x, this.left_child.min_x);
    this.min_y = Math.min(this.right_child.min_y, this.left_child.min_y);
    this.max_x = Math.max(this.right_child.max_x, this.left_child.max_x);
    this.max_y = Math.max(this.right_child.max_y, this.left_child.max_y);
  }
}

class AABBBranch extends AABBNode{
  constructor(min_x, min_y, max_x, max_y, parent, left_child, right_child){
    super(min_x, min_y, max_x, max_y, parent);
    this.left_child = left_child;
    this.right_child = right_child;
    this.resize();
  }
}

class AABBLeaf extends AABBNode{
  constructor(min_x, min_y, max_x, max_y, parent, object){
    super(min_x, min_y, max_x, max_y, parent);
    this.object = object;
    this.explored = false;
  }
}