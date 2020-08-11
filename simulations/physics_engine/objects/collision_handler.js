class CollisionHandler{
  static impulseResponse(collision){
    var restitution = Math.min(collision.fixture_1.restitution, collision.fixture_2.restitution);
    var friction = Math.min(collision.fixture_1.friction, collision.fixture_2.friction);
    var r_1 = Vec2.subtract(collision.location, collision.fixture_1.body.position);
    var r_2 = Vec2.subtract(collision.location, collision.fixture_2.body.position);
    var v_1 = new Vec2(collision.fixture_1.body.velocity.x - collision.fixture_1.body.omega * r_1.y, collision.fixture_1.body.velocity.y + collision.fixture_1.body.omega * r_1.x);
    var v_2 = new Vec2(collision.fixture_2.body.velocity.x - collision.fixture_2.body.omega * r_2.y, collision.fixture_2.body.velocity.y + collision.fixture_2.body.omega * r_2.x);
    var v_rel = Vec2.subtract(v_2, v_1);
    var v_rel_proj = Vec2.dotProduct(v_rel, collision.normal);
    var r_1_x_n = Vec2.crossProduct(r_1, collision.normal);
    var r_2_x_n = Vec2.crossProduct(r_2, collision.normal);
    var body_1_inv_inertia = 1 / collision.fixture_1.body.m_inertia;
    var body_2_inv_inertia = 1 / collision.fixture_2.body.m_inertia;
    if(collision.fixture_1.body.static){body_1_inv_inertia = 0};
    if(collision.fixture_2.body.static){body_2_inv_inertia = 0};
    var r_1_x_n_x_r_1 = new Vec2(body_1_inv_inertia * -r_1_x_n * r_1.y, body_1_inv_inertia * r_1_x_n * r_1.x); //bruhh, fix this naming
    var r_2_x_n_x_r_2 = new Vec2(body_2_inv_inertia * -r_2_x_n * r_2.y, body_2_inv_inertia * r_2_x_n * r_2.x);
    var m_inertia_sum = new Vec2(r_1_x_n_x_r_1.x + r_2_x_n_x_r_2.x, r_1_x_n_x_r_1.y + r_2_x_n_x_r_2.y);
    var inverse_rotational_mass = Vec2.dotProduct(m_inertia_sum, collision.normal);
    var body_1_inv_mass = 1 / collision.fixture_1.body.mass;
    var body_2_inv_mass = 1 / collision.fixture_2.body.mass;
    if(collision.fixture_1.body.static){body_1_inv_mass = 0};
    if(collision.fixture_2.body.static){body_2_inv_mass = 0};
    var denominator = body_1_inv_mass + body_2_inv_mass + inverse_rotational_mass;
    var impulse = Math.abs((1 + restitution) * v_rel_proj / denominator);
 
    var impulse_1 = Vec2.multiply(collision.normal, impulse);
    var impulse_2 = Vec2.reverse(impulse_1);
    var com_1_direction = Vec2.dotProduct(Vec2.reverse(r_1), collision.normal); //work on this
    var com_2_direction = Vec2.dotProduct(Vec2.reverse(r_2), collision.normal);
    if(com_1_direction < 0){
      impulse_1 = Vec2.reverse(impulse_1);
      impulse_2 = Vec2.reverse(impulse_2);
    }

    var v_1_direction = Vec2.dotProduct(Vec2.reverse(v_rel), collision.normal);
    var v_2_direction = Vec2.dotProduct(v_rel, collision.normal);
    if((v_1_direction < 0 && com_2_direction < 0 || v_1_direction > 0 && com_2_direction > 0) || (v_2_direction < 0 && com_1_direction < 0 || v_2_direction > 0 && com_1_direction > 0)){
      if(!collision.fixture_1.body.static){
        collision.fixture_1.body.applyImpulse(impulse_1, collision.location);
      }
      if(!collision.fixture_2.body.static){
        collision.fixture_2.body.applyImpulse(impulse_2, collision.location);
      }
    }else{
      var slop = 1;
      var percent = 0.4;
      var correction = Math.max(collision.penetration - slop, 0) * percent; 
      var displacement = Vec2.multiply(collision.normal, correction);
      if(com_1_direction > 0){
        if(!collision.fixture_1.body.static){collision.fixture_1.body.displace(displacement);}
        if(!collision.fixture_2.body.static){collision.fixture_2.body.displace(Vec2.reverse(displacement));}
      }else{
        if(!collision.fixture_1.body.static){collision.fixture_1.body.displace(Vec2.reverse(displacement));}
        if(!collision.fixture_2.body.static){collision.fixture_2.body.displace(displacement);}
      }
      impulse = 0;
    }
    
    var tangent = Vec2.rotate(collision.normal, Math.PI / 2);
    var friction_impulse = Vec2.multiply(tangent, -impulse * friction);
    var velocity_direction = Vec2.dotProduct(v_rel, tangent);
    if(velocity_direction > 0){
      velocity_direction = 1;
    }else if(velocity_direction < 0){
      velocity_direction = -1;
    }else{
      velocity_direction = 0;
    }
    if(!collision.fixture_1.body.static){
      collision.fixture_1.body.applyImpulse(Vec2.multiply(friction_impulse, -velocity_direction), collision.location);
    }
    if(!collision.fixture_2.body.static){
      collision.fixture_2.body.applyImpulse(Vec2.multiply(friction_impulse, velocity_direction), collision.location);
    }
  }
}