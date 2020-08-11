class AABBTree{
  constructor(){
    this.root = null;
    this.objects = [];
    this.count = 0;
  }

  insert(aabb, shape){
    var right_selected = true;
    if(this.objects.length == 0){
      var root = new AABBLeaf(aabb.min, aabb.max, null, shape);
      this.objects.push(root);
      this.root = root;
      return(root);
    }else{
      var new_object = new AABBLeaf(aabb.min, aabb.max, null, shape);
      var branch = this.root;
      var hit_bottom = false;
      do{
        if(!branch.left_child || !branch.right_child){
          hit_bottom = true;
        }else{
          var left_cost = branch.left_child.getNewArea(new_object);
          var right_cost = branch.right_child.getNewArea(new_object); 
          if(right_cost < left_cost){
            branch = branch.right_child;
            right_selected = true;
          }else{
            branch = branch.left_child;
            right_selected = false;
          } 
        }
      }while(!hit_bottom);
      var new_object_parent = new AABBBranch(new Vec2(0, 0), new Vec2(0, 0), branch.parent, branch, new_object);
      branch.parent = new_object_parent;
      new_object.parent = new_object_parent;
      if(branch == this.root){
        this.root = new_object_parent;
      }else{
        if(right_selected == true){
          new_object_parent.parent.right_child = new_object_parent;
        }else{
          new_object_parent.parent.left_child = new_object_parent;
        }
      }
      var level = new_object_parent.parent;
      while(level){
        level.resize();
        level = level.parent;
      }
      this.objects.push(new_object);
      return new_object;
    }
  }

  remove(leaf){  //Right now this breaks with one object
    var node = leaf;
    var parent = node.parent;
    var neighbor;
    if(!parent){
      this.root = null;
    }else{
      if(node == parent.right_child){
        neighbor = parent.left_child;
      }else if(node == parent.left_child){
        neighbor = parent.right_child;
      }
      neighbor.parent = parent.parent;
      if(parent.parent){
        if(parent.parent.right_child == parent){
          parent.parent.right_child = neighbor;
        }else{
          parent.parent.left_child = neighbor;
        }
        parent.parent.right_child.parent = parent.parent;
        parent.parent.left_child.parent = parent.parent;
        if(parent.parent == null){
          this.root = parent;
        }
      }else{
        this.root = neighbor;
        neighbor.parent = null;
      }
    }
    var level = neighbor.parent;
    while(level){
      level.resize();
      level = level.parent;
    }
    this.objects.splice(this.objects.indexOf(leaf), 1);
  }

  getCollisionsList(){
    var collision_list = [];
    for(var i = 0; i < this.objects.length; i++){
      var stack = [this.root];
      while(stack.length){
        var node = stack.pop();
        if(AABB.doTheyCollide(node, this.objects[i])){
          if(node.left_child){
            stack.push(node.left_child);
          }
          if(node.right_child){
            stack.push(node.right_child);
          }
          if(!node.right_child && !node.left_child){
            if(!node.explored && node != this.objects[i]){
              collision_list.push([node.object, this.objects[i].object]);
            }
          }
        }
      }
      this.objects[i].explored = true;
    }
    for(var i = 0; i < this.objects.length; i++){
      this.objects[i].explored = false;
    }
    return collision_list;
  }

  draw(ctx, node, color){
    var colors = ["red", "orange", "green", "blue", "purple", "pink"] 
    ctx.strokeStyle = colors[color];
    ctx.strokeRect(node.min.x, node.min.y, node.max.x - node.min.x, node.max.y - node.min.y);
    /*if(node.parent){
      ctx.beginPath();
      ctx.moveTo((node.parent.min.x + node.parent.max.x) / 2, (node.parent.min.y + node.parent.max.y) / 2);
      ctx.lineTo((node.min.x + node.max.x) / 2, (node.min.y + node.max.y) / 2);
      ctx.stroke();
    }*/
    if(node.left_child){this.draw(ctx, node.left_child, color + 1);}
    if(node.right_child){this.draw(ctx, node.right_child, color + 1);}
  }
}