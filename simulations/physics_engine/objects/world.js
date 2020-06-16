class World{
  constructor(dt){
    this.g_x = 0;
    this.g_y = 0;
    this.bodies = [];
    this.walls = [];
    this.dt = dt;

    this.collisionDetector = new CollisionDetector();
    this.counter = 0;
  }
  setGravity(f_x, f_y){
    this.g_x = f_x;
    this.g_y = f_y;
  }
  addBody(new_body){
    this.bodies.push(new_body);
    this.collisionDetector.addShape(new_body);
  }
  addWall(new_wall){
    this.walls.push(new_wall);
  }
  step(){
    for (var i = 0; i < this.bodies.length; i++){
      this.bodies[i].applyForce(this.g_x * this.bodies[i].m, this.g_y * this.bodies[i].m, this.dt);
      this.bodies[i].displace(this.dt);
      for(var j = 0; j < this.walls.length; j++){
        CollisionHandler.detectCircleWall(this.bodies[i], this.walls[j], dt);
      }
    }
    this.collisionDetector.update();
    var collisions = this.collisionDetector.getCollisions();
    for(var i = 0; i < collisions.length; i++){
      CollisionHandler.CircleCircle(collisions[i][0], collisions[i][1]);
    }
  }
  draw(ctx){
    ctx.fillStyle = "white";
    ctx.clearRect(0, 0, 450, 450);
    for (var i = 0; i < this.bodies.length; i++){
      this.bodies[i].draw(ctx);
    }
    for (var i = 0; i < this.walls.length; i++){
      this.walls[i].draw(ctx);
    }
    this.collisionDetector.draw(ctx);
  }
}