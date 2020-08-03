class CircleShape{
  constructor(x, y, r){
    this.x = x;
    this.y = y;
    this.r = r;
  }
  generateAABB(x, y, angle){
    return new AABB(x - this.r, y - this.r, x + this.r, y + this.r);
  }
  calculateArea(){
    return Math.PI * this.r * this.r;
  }
  calculateAreaMomentOfInerta(){
    return 0.5 * Math.PI * Math.pow(this.r, 4);
  }
  draw(canvas, x, y, theta){
    canvas.strokeStyle = "black";
    canvas.beginPath();
    canvas.arc(x, y, this.r, 0, 2*Math.PI);
    canvas.stroke();
    canvas.beginPath();
    canvas.moveTo(x, y);
    canvas.lineTo(x + this.r * Math.cos(theta), y + this.r * Math.sin(theta));
    canvas.stroke();
  }
}