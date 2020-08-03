class PolygonShape{
  constructor(vertices){
    this.vertices = vertices;
    this.setCentroidOrigin();
  }
  generateAABB(x, y, angle){
    var min_x = x + this.vertices[0][0] * Math.cos(angle) - this.vertices[0][1] * Math.sin(angle);
    var min_y = y + this.vertices[0][0] * Math.sin(angle) + this.vertices[0][1] * Math.cos(angle);
    var max_x = min_x;
    var max_y = min_y;
    for(var i = 1; i < this.vertices.length; i++){
      var vertex_x = x + this.vertices[i][0] * Math.cos(angle) - this.vertices[i][1] * Math.sin(angle);
      var vertex_y = y + this.vertices[i][0] * Math.sin(angle) + this.vertices[i][1] * Math.cos(angle);
      if(vertex_x < min_x){min_x = vertex_x};
      if(vertex_y < min_y){min_y = vertex_y};
      if(vertex_x > max_x){max_x = vertex_x};
      if(vertex_y > max_y){max_y = vertex_y};
    }
    return new AABB(min_x, min_y, max_x, max_y);
  }
  calculateArea(){
    var total = 0;
    for(var i = 0; i < this.vertices.length - 1; i++){
      total += this.vertices[i][0] * this.vertices[i + 1][1] - this.vertices[i + 1][0] * this.vertices[i][1];
    }
    total += this.vertices[this.vertices.length - 1][0] * this.vertices[0][1] - this.vertices[0][0] * this.vertices[this.vertices.length - 1][1];
    total /= 2;
    return total;
  }
  setCentroidOrigin(){
    var x_total = 0;
    var y_total = 0;
    for(var i = 0; i < this.vertices.length - 1; i++){
      x_total += (this.vertices[i][0] + this.vertices[i + 1][0]) * (this.vertices[i][0] * this.vertices[i + 1][1] - this.vertices[i + 1][0] * this.vertices[i][1]);
      y_total += (this.vertices[i][1] + this.vertices[i + 1][1]) * (this.vertices[i][0] * this.vertices[i + 1][1] - this.vertices[i + 1][0] * this.vertices[i][1]); 
    }
    x_total += (this.vertices[this.vertices.length - 1][0] + this.vertices[0][0]) * (this.vertices[this.vertices.length - 1][0] * this.vertices[0][1] - this.vertices[0][0] * this.vertices[this.vertices.length - 1][1]);
    y_total += (this.vertices[this.vertices.length - 1][1] + this.vertices[0][1]) * (this.vertices[this.vertices.length - 1][0] * this.vertices[0][1] - this.vertices[0][0] * this.vertices[this.vertices.length - 1][1]); 
    x_total /= 6 * this.calculateArea();
    y_total /= 6 * this.calculateArea();
    for(var i = 0; i < this.vertices.length; i++){
      this.vertices[i][0] -= x_total;
      this.vertices[i][1] -= y_total;
    }
  }
  calculateAreaMomentOfInerta(){
    var total = 0;
    var centroid = [0, 0];
    for(var i = 0; i < this.vertices.length - 1; i++){
      var triangle_area = centroid[0] * (this.vertices[i][1] - this.vertices[i + 1][1]) + this.vertices[i][0] * (this.vertices[i + 1][1] - centroid[1]) + this.vertices[i + 1][0] * (centroid[1] - this.vertices[i][1]);
      total += (this.vertices[i][0] * this.vertices[i + 1][1] + 2 * this.vertices[i][0] * this.vertices[i][0] + 2 * this.vertices[i + 1][0] * this.vertices[i + 1][0] + this.vertices[i + 1][0] * this.vertices[i][1]) * triangle_area;
    }
    triangle_area = centroid[0] * (this.vertices[this.vertices.length - 1][1] - this.vertices[0][1]) + this.vertices[0][0] * (this.vertices[this.vertices.length - 1][1] - centroid[1]) + this.vertices[0][0] * (centroid[1] - this.vertices[this.vertices.length - 1][1]);
    total += (this.vertices[this.vertices.length - 1][0] * this.vertices[0][1] + 2 * this.vertices[this.vertices.length - 1][0] * this.vertices[this.vertices.length - 1][0] + 2 * this.vertices[0][0] * this.vertices[0][0] + this.vertices[0][0] * this.vertices[this.vertices.length - 1][1]) * triangle_area;
    total /= 24;
    return total;
  }
  draw(canvas, x, y, theta){
    canvas.fillStyle = "black";
    canvas.strokeStyle = "white";
    canvas.beginPath();
    canvas.moveTo(x + Math.cos(theta) * this.vertices[0][0] - Math.sin(theta) * this.vertices[0][1], 
                  y + Math.sin(theta) * this.vertices[0][0] + Math.cos(theta) * this.vertices[0][1]);
    for(var i = 1; i < this.vertices.length; i++){
      canvas.lineTo(x + Math.cos(theta) * this.vertices[i][0] - Math.sin(theta) * this.vertices[i][1], 
                    y + Math.sin(theta) * this.vertices[i][0] + Math.cos(theta) * this.vertices[i][1]);
    }
    canvas.closePath();
    canvas.fill();
  }
}