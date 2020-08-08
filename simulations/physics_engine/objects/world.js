class World{
  constructor(dt){
    this.g_x = 0;
    this.g_y = 0;
    this.bodies = [];
    this.springs = [];
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
    for(var i = 0; i < new_body.fixtures.length; i++){
      this.collisionDetector.add(new_body.fixtures[i].shape.generateAABB(new_body.x, new_body.y, new_body.theta), new_body.fixtures[i]);
    }
  }
  addSpring(new_spring){
    this.springs.push(new_spring);
  }
  deleteSpring(spring){
    for(var i = 0; i < this.springs.length; i++){
      if(spring == this.springs[i]){
        this.springs.splice(i, 1);
      }
    }
  }
  step(){
    for(var i = 0; i < this.springs.length; i++){
      this.springs[i].step(this.dt);
    }
    for (var i = 0; i < this.bodies.length; i++){
      this.bodies[i].applyUniformForce(this.g_x * this.bodies[i].mass, this.g_y * this.bodies[i].mass, this.dt);
      this.bodies[i].step(this.dt);
    }
    this.collisionDetector.update();
    var collisions = this.collisionDetector.getCollisions();
    for(var i = 0; i < collisions.length; i++){
      CollisionHandler.impulseResponse(collisions[i]);
    }
  }
  draw(ctx){
    ctx.fillStyle = "white";
    ctx.clearRect(0, 0, 450, 450);
    for (var i = 0; i < this.bodies.length; i++){
      this.bodies[i].draw(ctx);
    }
    for(var i = 0; i < this.springs.length; i++){
      this.springs[i].draw(ctx);
    }
    if(document.getElementById("showAABB").checked){this.collisionDetector.draw(ctx)};
  }
}