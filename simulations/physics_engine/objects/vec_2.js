class Vec2{
  constructor(x, y){
    this.x = x;
    this.y = y;
  }
  static add(vector_1, vector_2){
    return new Vec2(vector_1.x + vector_2.x, vector_1.y + vector_2.y);
  }
  static dotProduct(vector_1, vector_2){
    return vector_1.x * vector_2.x + vector_1.y * vector_2.y;
  }
  static crossProduct(vector_1, vector_2){
    return vector_1.x + vector_2.y - vector_1.y + vector_2.x;
  }
  static magnitude(vector){
    return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
  }
  static normalize(vector){
    var magnitude = Vec2.magnitude(vector);
    return new Vec2(vector.x / magnitude, vector.y / magnitude);
  }
  static rotate(vector, angle){
    var rotated_x = vector.x * Math.cos(angle) - vector.y * Math.sin(angle);
    var rotated_y = vector.x * Math.sin(angle) + vector.y * Math.cos(angle);
    return new Vec2(rotated_x, rotated_y);
  }
  static scale(vector, scale_factor){
    return new Vec2(vector.x / scale_factor, vector.y / scale_factor);
  }
}