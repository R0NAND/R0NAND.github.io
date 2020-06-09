class AABBNode{
    constructor(min_x, min_y, max_x, max_y, parent, left, right){
      this.min_x = min_x;
      this.min_y = min_y;
      this.max_x = max_x;
      this.max_y = max_y;
      this.parent = parent;
      this.left = left;
      this.right = right;
    }
}