class CircleShape{
  constructor(x, y, r){
    this.position = new Vec2(x, y);
    this.r = r;
  }
  generateAABB(translation, rotation){
    var circle_center = Vec2.add(translation, this.position);
    var min = Vec2.subtract(circle_center, new Vec2(this.r, this.r));
    var max = Vec2.add(circle_center, new Vec2(this.r, this.r));
    return new AABB(min, max);
  }
  calculateArea(){
    return Math.PI * this.r * this.r;
  }
  calculateAreaMomentOfInerta(){
    return 0.5 * Math.PI * Math.pow(this.r, 4);
  }
  draw(canvas, translation, rotation){
    canvas.strokeStyle = "black";
    canvas.beginPath();
    canvas.arc(translation.x, translation.y, this.r, 0, 2 * Math.PI);
    canvas.stroke();
    canvas.beginPath();
    canvas.moveTo(translation.x, translation.y);
    canvas.lineTo(translation.x + this.r * Math.cos(rotation), translation.y + this.r * Math.sin(rotation));
    canvas.stroke();
  }
}