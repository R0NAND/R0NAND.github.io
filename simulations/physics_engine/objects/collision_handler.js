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

    var impulse = (Math.abs((1 + restitution) * v_rel_proj) / (collision.fixture_1.body.inv_mass + collision.fixture_2.body.inv_mass + Vec2.dotProduct(Vec2.add(Vec2.multiply(Vec2.zCrossProduct(Vec2.crossProduct(r_1, collision.normal), r_1), collision.fixture_1.body.inv_m_inertia), Vec2.multiply(Vec2.zCrossProduct(Vec2.crossProduct(r_2, collision.normal), r_2), collision.fixture_2.body.inv_m_inertia)), collision.normal)));
 
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
      collision.fixture_1.body.applyImpulse(impulse_1, collision.location);
      collision.fixture_2.body.applyImpulse(impulse_2, collision.location);
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
    collision.fixture_1.body.applyImpulse(Vec2.multiply(friction_impulse, -velocity_direction), collision.location);
    collision.fixture_2.body.applyImpulse(Vec2.multiply(friction_impulse, velocity_direction), collision.location);
  }

  static separateBodies(collision){
    var slop = 0.1;
    var percent = 0.4;
    var correction = Math.max(collision.penetration - slop, 0) * percent; 
    var displacement = Vec2.multiply(collision.normal, correction);
    var r_1 = Vec2.subtract(collision.location, collision.fixture_1.body.position);
    var com_1_direction = Vec2.dotProduct(Vec2.reverse(r_1), collision.normal); //work on this
    if(com_1_direction > 0){
      if(!collision.fixture_1.body.static){collision.fixture_1.body.displace(displacement);}
      if(!collision.fixture_2.body.static){collision.fixture_2.body.displace(Vec2.reverse(displacement));}
    }else{
      if(!collision.fixture_1.body.static){collision.fixture_1.body.displace(Vec2.reverse(displacement));}
      if(!collision.fixture_2.body.static){collision.fixture_2.body.displace(displacement);}
    }
  }
}
