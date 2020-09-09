class Boid{
  constructor(location, velocity, coherence, separation, alignment, sight, max_speed){
    this.location = location;
    this.velocity = velocity;
    this.coherence = coherence;
    this.separation = separation;
    this.alignment = alignment;
    this.sight = sight;
    this.max_speed = max_speed;
    this.separation_distance = 25;
    this.neighors = [];
    this.new_velocity = glMatrix.vec3.create();
  }
  cohere(){
    if(this.neighbors.length){
      var center = glMatrix.vec3.create();
      for (var i = 0; i < this.neighbors.length; i++){
        glMatrix.vec3.add(center, center, this.neighbors[i].location);
      }
      glMatrix.vec3.scale(center, center, 1 / this.neighbors.length);
      var to_center = glMatrix.vec3.create();
      glMatrix.vec3.subtract(to_center, center, this.location);
      glMatrix.vec3.add(this.new_velocity, this.new_velocity, glMatrix.vec3.scale(to_center, to_center, this.coherence));
    }
  }
  separate(){
    if(this.neighbors.length){
      var separation = glMatrix.vec3.create();
      for (var i = 0; i < this.neighbors.length; i++){
        if(glMatrix.vec3.distance(this.location, this.neighbors[i].location) < this.separation_distance){
          glMatrix.vec3.add(separation, separation, glMatrix.vec3.subtract(glMatrix.vec3.create(), this.location, this.neighbors[i].location));
        }
      }
      glMatrix.vec3.scale(separation, separation, 1 / this.neighbors.length);
      glMatrix.vec3.add(this.new_velocity, this.new_velocity, glMatrix.vec3.scale(glMatrix.vec3.create(), separation, this.separation));
    }
  }
  align(){
    if(this.neighbors.length){
      var mean_velocity = glMatrix.vec3.create();
      for (var i = 0; i < this.neighbors.length; i++){
        glMatrix.vec3.add(mean_velocity, mean_velocity, this.neighbors[i].velocity);
      }
      glMatrix.vec3.scale(mean_velocity, mean_velocity, 1 / this.neighbors.length);
      var to_mean_velocity = glMatrix.vec3.create();
      glMatrix.vec3.subtract(to_mean_velocity, mean_velocity, this.velocity);
      glMatrix.vec3.add(this.new_velocity, this.new_velocity, glMatrix.vec3.scale(to_mean_velocity, to_mean_velocity, this.alignment));
    }
  }
  boundaries(){ //THIS IS CURRENTLY HARDCODED. FIX LATER
    if(this.location[0] < -100){
      this.new_velocity[0] = 200;
    }
    if(this.location[0] > 100){
      this.new_velocity[0] = -200;
    }
    if(this.location[1] < -100){
      this.new_velocity[1] = 200;
    }
    if(this.location[1] > 100){
      this.new_velocity[1] = -200;
    }
    if(this.location[2] < -100){
      this.new_velocity[2] = 200;
    }
    if(this.location[2] > 100){
      this.new_velocity[2] = -200;
    }
  }
  step(timestep){
    this.new_velocity = this.velocity;
    this.cohere();
    this.separate();
    this.align();
    this.boundaries();
    var speed = glMatrix.vec3.length(this.new_velocity);
    if(glMatrix.vec3.length(this.new_velocity) > this.max_speed){
      glMatrix.vec3.normalize(this.new_velocity, this.new_velocity, this.max_speed / speed);
    }
    this.velocity = this.new_velocity;
    glMatrix.vec3.add(this.location, this.location, glMatrix.vec3.scale(glMatrix.vec3.create(), this.velocity, timestep)); 
  }
}