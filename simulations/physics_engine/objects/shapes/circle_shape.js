class CircleShape{
  constructor(x, y, r){
    this.x = x;
    this.y = y;
    this.r = r;
  }
  generateAABB(x, y, angle){
    return new AABB(x + this.x - this.r, y + this.y - this.r, x + this.x + this.r, y + this.y + this.r);
  }
  calculateArea(){
    return Math.PI * this.r * this.r;
  }
  calculateAreaMomentOfInerta(){
    return 0.5 * Math.PI * Math.pow(this.r, 4);
  }
}