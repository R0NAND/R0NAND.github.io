class CollisionDetector{
  constructor(){
      this.collision_tree = new AABBTree();
      this.objects = [];
      this.aabbs = [];
      this.box_buffer = 5;
  }

  addShape(shape){
    this.objects.push(shape);
    var aabb = this.generateAABB(shape);
    this.aabbs.push(this.collision_tree.insert(aabb[0], aabb[1], aabb[2], aabb[3], shape));
  }

  update(){
    for(var i = 0; i < this.objects.length; i++){
      if(this.objects[i].x - this.objects[i].r < this.aabbs[i].min_x ||
         this.objects[i].x + this.objects[i].r > this.aabbs[i].max_x ||
         this.objects[i].y - this.objects[i].r < this.aabbs[i].min_y ||
         this.objects[i].y + this.objects[i].r > this.aabbs[i].max_y){
          this.collision_tree.remove(this.aabbs[i]);
          var new_aabb = this.generateAABB(this.objects[i]);
          this.aabbs[i] = this.collision_tree.insert(new_aabb[0], new_aabb[1], new_aabb[2], new_aabb[3], this.objects[i]);
      }
    }
  }

  getCollisions(){
    var candidates = this.collision_tree.getCollisionsList();
    for(var i = 0; i < candidates.length; i++){
      if(!this.doTheyCollide(candidates[i][0], candidates[i][1])){
        candidates.splice(i, 1);
        i--;
      }
    }
    return candidates;
  }

  doTheyCollide(shape_1, shape_2){
    var distance = Math.sqrt(Math.pow((shape_1.x - shape_2.x), 2) + Math.pow((shape_1.y - shape_2.y), 2));
    if(distance <= (shape_1.r + shape_2.r)){
      return 1;
    }else{
      return 0;
    }
  }

  generateAABB(circle){
    return [circle.x - circle.r - this.box_buffer, circle.y - circle.r - this.box_buffer, circle.x + circle.r + this.box_buffer, circle.y + circle.r + this.box_buffer];
  }

  draw(ctx){
    this.collision_tree.draw(ctx, this.collision_tree.root, 0);
  }



  detectCollision(){

  }
}

