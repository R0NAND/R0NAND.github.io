class RigidBody{
  constructor(x, y, u, v, t, o){
    this.mass = 0;
    this.x = x;
    this.y = y;
    this.u = u;
    this.v = v;
    this.m_inertia = 0;
    this.theta = t;
    this.omega = o;
    this.fixtures = [];
    this.static = 0;
  }
  addFixture(fixture){
    fixture.body = this;

    this.mass = fixture.shape.calculateArea() * fixture.density;
    this.m_inertia = fixture.shape.calculateAreaMomentOfInerta() * fixture.density;
    this.fixtures.push(fixture);
  }
  applyImpulse(i_x, i_y, p_x, p_y){
    this.u += p_x / this.mass;
    this.v += p_y / this.mass;
    this.omega += (p_y * (i_x - this.x) - p_x * (i_y - this.y)) / this.m_inertia; 
  }
  applyForce(x, y, f_x, f_y, dt){
    if(!this.static){
      this.u += f_x / this.mass * dt;
      this.v += f_y / this.mass * dt;
      this.omega += (f_y * (x - this.x) - f_x * (y - this.y)) / this.m_inertia * dt;
    }
  }
  applyUniformForce(f_x, f_y, dt){
    if(!this.static){
      this.u += f_x / this.mass * dt;
      this.v += f_y / this.mass * dt;
    }
  }
  displace(x, y){
    this.x += x;
    this.y += y;
  }
  step(dt){
    if(!this.static){
      if (this.omega > 3){
        this.omega = 3;
      }else if (this.omega < -3){
        this.omega = -3;
      }
      this.x += this.u * dt;
      this.y += this.v * dt;
      this.theta += this.omega * dt;
    }else{
      this.u = 0;
      this.v = 0;
      this.omega = 0;
    }
  }
  setStatic(){
    this.static = 1;
    this.u = 0;
    this.v = 0;
    this.omega = 0;
  }
  draw(canvas){
    for(var i = 0; i < this.fixtures.length; i++){
      this.fixtures[i].shape.draw(canvas, this.x, this.y, this.theta);
    }
  }
}