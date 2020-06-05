class AABBTree{
  constructor(){
    this.size = 0;
    this.objects = [];
    this.root = null;
  }
  insert(min_x, min_y, max_x, max_y){
    this.objects.push({min_x:min_x, min_y:min_y, max_x:max_x, max_y:max_y, left:null, right:null});
    if(this.size == 0){
      this.root = this.objects[0];
    }else{
      var branch = this.root;
      do{
        
        if(min_x < branch.min_x){branch.min_x = min_x;}
        if(min_y < branch.min_y){branch.min_y = min_y;}
        if(max_x > branch.max_x){branch.max_x = max_x;}
        if(max_y > branch.max_y){branch.max_y = max_y;}
      }while();
    }
    this.size++;
  }
  draw(canvas){
    canvas.strokeStyle = "red";
    for(var i = 0; i < this.size; i++){
      canvas.beginPath();
      canvas.rect(this.objects[i].min_x, this.objects[i].min_y, this.objects[i].max_x, this.objects[i].max_y);
      canvas.stroke();
    }
  }
}