class PolygonShape{
  constructor(vertices){  //still need to add convex validation
    this.vertices = vertices;
    this.setCentroidOrigin();
  }
  generateAABB(translation, rotation){
    var min = Vec2.add(translation, Vec2.rotate(this.vertices[0], rotation));
    var max = Vec2.add(translation, Vec2.rotate(this.vertices[0], rotation));
    for(var i = 1; i < this.vertices.length; i++){
      var vertex = Vec2.add(translation, Vec2.rotate(this.vertices[i], rotation));
      if(vertex.x < min.x){min.x = vertex.x;}
      if(vertex.y < min.y){min.y = vertex.y;}
      if(vertex.x > max.x){max.x = vertex.x;}
      if(vertex.y > max.y){max.y = vertex.y;}
    }
    return new AABB(min, max);
  }
  calculateArea(){
    var total = 0;
    for(var i = 0; i < this.vertices.length - 1; i++){
      total += Vec2.crossProduct(this.vertices[i], this.vertices[i + 1]);
    }
    total += Vec2.crossProduct(this.vertices[this.vertices.length - 1], this.vertices[0]);
    total /= 2;
    return total;
  }
  setCentroidOrigin(){
    var total = new Vec2(0, 0);
    for(var i = 0; i < this.vertices.length - 1; i++){
      total = Vec2.add(total, Vec2.multiply(Vec2.add(this.vertices[i], this.vertices[i + 1]),  Vec2.crossProduct(this.vertices[i], this.vertices[i + 1])));
    }
    total = Vec2.add(total, Vec2.multiply(Vec2.add(this.vertices[this.vertices.length - 1], this.vertices[0]),  Vec2.crossProduct(this.vertices[this.vertices.length - 1], this.vertices[0])));
    total = Vec2.divide(total, 6 * this.calculateArea());
    for(var i = 0; i < this.vertices.length; i++){
      this.vertices[i] = Vec2.subtract(this.vertices[i], total);
    }
  }
  calculateAreaMomentOfInerta(){
    var total = 0;
    var triangle_area;
    for(var i = 0; i < this.vertices.length - 1; i++){
      triangle_area = Vec2.crossProduct(this.vertices[i], this.vertices[i + 1]);
      total += (this.vertices[i].x * this.vertices[i + 1].y + 2 * this.vertices[i].x * this.vertices[i].x + 2 * this.vertices[i + 1].x * this.vertices[i + 1].x + this.vertices[i + 1].x * this.vertices[i].y) * triangle_area;
    }
    triangle_area = Vec2.crossProduct(this.vertices[this.vertices.length - 1], this.vertices[0]);
    total += (this.vertices[this.vertices.length - 1].x * this.vertices[0].y + 2 * this.vertices[this.vertices.length - 1].x * this.vertices[this.vertices.length - 1].x + 2 * this.vertices[0].x * this.vertices[0].x + this.vertices[0].x * this.vertices[this.vertices.length - 1].y) * triangle_area;
    total /= 24;
    return total;
  }
  draw(canvas, translation, rotation){
    canvas.strokeStyle = "black";
    canvas.beginPath();
    var point = Vec2.add(translation, Vec2.rotate(this.vertices[0], rotation));
    canvas.moveTo(point.x, point.y);
    for(var i = 1; i < this.vertices.length; i++){
      point = Vec2.add(translation, Vec2.rotate(this.vertices[i], rotation));
      canvas.lineTo(point.x, point.y);
    }
    canvas.closePath();
    canvas.stroke();
  }
}