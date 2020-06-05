class World{
  constructor(dt){
    this.g_x = 0;
    this.g_y = 0;
    this.bodies = [];
    this.walls = [];
    this.dt = dt;
  }
  setGravity(f_x, f_y){
    this.g_x = f_x;
    this.g_y = f_y;
  }
  addBody(new_body){
    this.bodies.push(new_body);
  }
  addWall(new_wall){
    this.walls.push(new_wall);
  }
  step(){
    for (var i = 0; i < this.bodies.length; i++){
      this.bodies[i].applyForce(this.g_x * this.bodies[i].m, this.g_y * this.bodies[i].m, this.dt);
      for (var j = i + 1; j < this.bodies.length; j++){
        CollisionHandler.detectCircleCircle(this.bodies[i], this.bodies[j], dt);
      }
      for (var j = 0; j < this.walls.length; j++){
        CollisionHandler.detectCircleWall(this.bodies[i], this.walls[j], dt);
      }
      this.bodies[i].displace(this.dt);
    }
  }
  draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < this.bodies.length; i++){
      this.bodies[i].draw();
    }
    for (var i = 0; i < this.walls.length; i++){
      this.walls[i].draw();
    }
  }
}