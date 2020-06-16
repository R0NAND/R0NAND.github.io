class Wall{
  constructor(x_1, y_1, x_2, y_2){
    this.x_1 = x_1;
    this.y_1 = y_1;
    this.x_2 = x_2;
    this.y_2 = y_2;
    this.a = this.y_2 - this.y_1;
    this.b = this.x_1 - this.x_2;
    this.c = -(this.a * this.x_1 + this.b * this.y_1); 
  }
  side(x, y){
    var val = this.a * x + this.b * y + this.c;
    if (val < 0){
      val = -1;
    }else if (val > 0){
      val = 1;
    }else{
      val = 0;
    }
    return val;
  }
  direction(x_1, y_1, x_2, y_2){
    var val_1 = Math.abs(this.a * x_1 + this.b * y_1 + this.c);
    var val_2 = Math.abs(this.a * x_2 + this.b * y_2 + this.c);
    return (val_2 < val_1);
  }
  draw(ctx){
    ctx.strokeStyle = "black";
    ctx.beginPath(); 
    ctx.moveTo(this.x_1, this.y_1);
    ctx.lineTo(this.x_2, this.y_2); 
    ctx.stroke();
  }
}