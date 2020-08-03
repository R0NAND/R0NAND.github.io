class Fixture{
  constructor(shape, density, friction, restitution){
    this.shape = shape;
    this.restitution = restitution;
    this.friction = friction;
    this.density = density;
  }
  setRestitution(r){
    this.restitution = r;
  }
  setFriction(f){
    this.friction = f;
  }
  setDensity(d){
    this.density = d;
  }
}