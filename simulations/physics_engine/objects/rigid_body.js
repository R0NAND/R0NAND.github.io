class RigidBody{
  constructor(x, y, u, v, t, o){
    this.mass = 0;
    this.inv_mass = 0;
    this.position = new Vec2(x, y);
    this.velocity = new Vec2(u, v);
    this.m_inertia = 0;
    this.inv_m_inertia = 0;
    this.theta = t;
    this.omega = o;
    this.fixtures = [];
    this.static = 0;
  }
  addFixture(fixture){
    fixture.body = this;
    this.mass = fixture.shape.calculateArea() * fixture.density;
    this.m_inertia = fixture.shape.calculateAreaMomentOfInerta() * fixture.density;
    this.inv_mass = 1 / this.mass;
    this.inv_m_inertia = 1 / this.m_inertia
    this.fixtures.push(fixture);
  }
  applyImpulse(impulse, location){
    var velocity_change = Vec2.multiply(impulse, this.inv_mass);
    this.velocity = Vec2.add(this.velocity, velocity_change);
    var location_from_center = Vec2.subtract(location, this.position);
    var spin_change = Vec2.crossProduct(location_from_center, impulse) * this.inv_m_inertia;
    this.omega += spin_change;
  }
  applyForce(force, location, dt){
    if(!this.static){
      var velocity_change = Vec2.multiply(force, dt / this.mass);
      this.velocity = Vec2.add(this.velocity, velocity_change);
      var location_from_center = Vec2.subtract(location, this.position);
      var spin_change = Vec2.crossProduct(location_from_center, force) * dt / this.m_inertia;
      this.omega += spin_change;
    }
  }
  applyUniformForce(force, dt){
    if(!this.static){
      var velocity_change = Vec2.multiply(force, dt / this.mass);
      this.velocity = Vec2.add(this.velocity, velocity_change);
    }
  }
  displace(displacement){
    this.position = Vec2.add(this.position, displacement);
  }
  step(dt){
    if(!this.static){
      if (this.omega > 30){  //REVISIT MAX SPEED CONSIDERATIONS
        this.omega = 30;
      }else if (this.omega < -30){
        this.omega = -30;
      }
      var position_change = Vec2.multiply(this.velocity, dt);
      this.position = Vec2.add(this.position, position_change);
      this.theta += this.omega * dt;
    }else{
      this.u = 0;
      this.v = 0;
      this.omega = 0;
    }
  }
  setStatic(){
    this.static = 1;
    this.velocity.set(0, 0);
    this.omega = 0;
    this.inv_mass = 0;
    this.inv_m_inertia = 0;
  }
  draw(canvas){
    for(var i = 0; i < this.fixtures.length; i++){
      this.fixtures[i].shape.draw(canvas, this.position, this.theta);
    }
  }
}