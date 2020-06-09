class AABBTree{
  constructor(){
    this.size = 0;
    this.root = null;
  }
  insert(min_x, min_y, max_x, max_y){
    var right_selected = true;
    if(this.size == 0){
      var root = new AABBNode(min_x, min_y, max_x, max_y, null, null, null);
      this.root = root;
    }else{
      var branch = this.root;
      var hit_bottom = false;
      do{
        if(!branch.left || !branch.right){
          hit_bottom = true;
        }else{
          var left_cost = (Math.max(branch.left.max_x, max_x) - Math.min(branch.left.min_x, min_x)) * (Math.max(branch.left.max_y, max_y) - Math.min(branch.left.min_y, min_y));
          var right_cost = (Math.max(branch.right.max_x, max_x) - Math.min(branch.right.min_x, min_x)) * (Math.max(branch.right.max_y, max_y) - Math.min(branch.right.min_y, min_y)); 
          if(right_cost < left_cost){
            branch = branch.right;
            right_selected = true;
          }else{
            branch = branch.left;
            right_selected = false;
          } 
        }
      }while(!hit_bottom);
      var parent_min_x = Math.min(min_x, branch.min_x);
      var parent_min_y = Math.min(min_y, branch.min_y);
      var parent_max_x = Math.max(max_x, branch.max_x);
      var parent_max_y = Math.max(max_y, branch.max_y);
      var parent = new AABBNode(parent_min_x, parent_min_y, parent_max_x, parent_max_y, branch.parent, branch, null);
      var new_object = new AABBNode(min_x, min_y, max_x, max_y, parent, null, null);
      parent.right = new_object;
      parent.left.parent = parent;
      if(this.size == 1){
        this.root = parent;
      }else{
        if(right_selected == true){
          parent.parent.right = parent;
        }else{
          parent.parent.left = parent;
        }
      }
      var level = parent.parent;
      while(level){
        level.min_x = Math.min(level.right.min_x, level.left.min_x);
        level.min_y = Math.min(level.right.min_y, level.left.min_y);
        level.max_x = Math.max(level.right.max_x, level.left.max_x);
        level.max_y = Math.max(level.right.max_y, level.left.max_y);
        level = level.parent;
      }
    }
    this.size++;
  }
  remove(leaf){
    this.objects.indexOf(leaf)
  }
  getCollisions(){

  }
  draw(canvas, node, color){
    var colors = ["red", "orange", "green", "blue", "purple", "pink"] 
    ctx.strokeStyle = colors[color];
    ctx.strokeRect(node.min_x, node.min_y, node.max_x - node.min_x, node.max_y - node.min_y);
    if(node.parent){
      ctx.beginPath();
      ctx.moveTo((node.parent.min_x + node.parent.max_x) / 2, (node.parent.min_y + node.parent.max_y) / 2);
      ctx.lineTo((node.min_x + node.max_x) / 2, (node.min_y + node.max_y) / 2);
      ctx.stroke();
    }
    if(node.left){this.draw(canvas, node.left, color + 1);}
    if(node.right){this.draw(canvas, node.right, color + 1);}
  }
}