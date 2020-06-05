class RidgidCircle{
  constructor(m, r, x, y, u, v){
    this.m = m;
    this.r = r;
    this.x = x;
    this.y = y;
    this.u = u;
    this.v = v;
    this.theta = 0;
    this.omega = 1;
  }
  applyForce(f_x, f_y, dt){
    this.u += f_x / this.m * dt;
    this.v += f_y / this.m * dt;
  }
  applyImpulse(p_x, p_y){
    this.u += p_x / this.m;
    this.v += p_y / this.m;
  }
  displace(dt){
    this.x += this.u * dt;
    this.y += this.v * dt;
    this.theta += this.omega * dt;
  }
  draw(){
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + this.r * Math.cos(this.theta), this.y + this.r * Math.sin(this.theta));
    ctx.stroke();
  }
}
