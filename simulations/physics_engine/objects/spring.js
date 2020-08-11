class Spring{
  constructor(body_1, location_1, body_2, location_2, stiffness, damping){
    this.body_1 = body_1;
    if(this.body_1){
      this.location_1 = Vec2.rotate(Vec2.subtract(location_1, body_1.position), -body_1.theta);
    }else{
      this.location_1 = location_1;
    }
    this.body_2 = body_2;
    if(this.body_2){
      this.location_2 = Vec2.rotate(Vec2.subtract(location_2, body_2.position), -body_2.theta);
    }else{
      this.location_2 = location_2;
    }
    this.stiffness = stiffness;
    this.damping = damping;
    this.length = Vec2.magnitude(Vec2.subtract(location_1, location_2));

    this.previous_end_1 = location_1;
    this.previous_end_2 = location_2;
  }

  step(dt){
    var end_1;
    var end_2;
    if(this.body_1){
      end_1 = Vec2.add(this.body_1.position, Vec2.rotate(this.location_1, this.body_1.theta));
    }else{
      end_1 = this.location_1;
    }
    if(this.body_2){
      end_2 = Vec2.add(this.body_2.position, Vec2.rotate(this.location_2, this.body_2.theta));
    }else{
      end_2 = this.location_2;
    }
    var velocity_1 = Vec2.divide(Vec2.subtract(end_1, this.previous_end_1), dt);
    var velocity_2 = Vec2.divide(Vec2.subtract(end_2, this.previous_end_2), dt);
    var v_rel = Vec2.subtract(velocity_1, velocity_2);
    var pos_rel_2_1 = Vec2.subtract(end_2, end_1);
    var distance = Vec2.magnitude(pos_rel_2_1);
    var delta_length = distance - this.length;
    var force_vector;
    if(distance != 0){
      force_vector = Vec2.divide(pos_rel_2_1, distance);
    }else{
      force_vector = new Vec2(0, 0);
    }
    var v_proj = Vec2.dotProduct(v_rel, force_vector);
    console.log(force_vector);
    var force = this.stiffness * delta_length - this.damping * v_proj;
    if(this.body_1){
      this.body_1.applyForce(Vec2.multiply(force_vector, force), end_1, dt);
    }
    if(this.body_2){
      this.body_2.applyForce(Vec2.multiply(force_vector, -force), end_2, dt);
    }
    this.previous_end_1 = end_1;
    this.previous_end_2 = end_2;
  }

  draw(canvas){
    var end_1;
    var end_2;
    if(this.body_1){
      end_1 = Vec2.add(this.body_1.position, Vec2.rotate(this.location_1, this.body_1.theta));
    }else{
      end_1 = this.location_1;
    }
    if(this.body_2){
      end_2 = Vec2.add(this.body_2.position, Vec2.rotate(this.location_2, this.body_2.theta));
    }else{
      end_2 = this.location_2;
    }
    canvas.strokeStyle = "black";
    canvas.beginPath();
    canvas.moveTo(end_1.x, end_1.y);
    canvas.lineTo(end_2.x, end_2.y);
    canvas.stroke();
  }
}