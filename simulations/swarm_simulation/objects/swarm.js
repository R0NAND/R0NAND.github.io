class Swarm{
  constructor(size){
    this.size = size;
    this.coherence = 0.01;
    this.separation = 0.15;
    this.alignment = 0.05;
    this.sight = 30;
    this.max_speed = 500;
    this.boids = [];
    for(var i = 0; i < size; i++){
      var location = glMatrix.vec3.fromValues(Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50);
      var velocity = glMatrix.vec3.fromValues(Math.random() * 100, Math.random() * 100, Math.random() * 100);
      this.boids.push(new Boid(location, velocity, this.coherence, this.separation, this.alignment, this.sight, this.max_speed));
    }
  }

  assignNeighbors(){
    for(var i = 0; i < this.size; i++){
      this.boids[i].neighbors = [];
    }
    for(var i = 0; i < this.size; i++){
      for(var j = i + 1; j < this.size; j++){
        if(glMatrix.vec3.distance(this.boids[i].location, this.boids[j].location) < this.sight){
          this.boids[i].neighbors.push(this.boids[j]);
          this.boids[j].neighbors.push(this.boids[i]);
        }
      }
    }
  }

  step(timestep){
    this.assignNeighbors();
    for(var i = 0; i < this.size; i++){
      this.boids[i].step(timestep);
    }
  }
}