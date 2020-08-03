class CollisionHandler{
  static impulseResponse(collision){
    var restitution;
    if(collision.fixture_1.restitution > collision.fixture_2.restitution){
      restitution = collision.fixture_2.restitution;
    }else{
      restitution = collision.fixture_1.restitution;
    }

    var friction;
    if(collision.fixture_1.friction > collision.fixture_2.friction){
      friction = collision.fixture_2.friction;
    }else{
      friction = collision.fixture_1.friction;
    }

    var r_1 = [collision.location[0] - collision.fixture_1.body.x, collision.location[1] - collision.fixture_1.body.y];
    var r_2 = [collision.location[0] - collision.fixture_2.body.x, collision.location[1] - collision.fixture_2.body.y];
    
    var v_1 = [collision.fixture_1.body.u - collision.fixture_1.body.omega * r_1[1], collision.fixture_1.body.v + collision.fixture_1.body.omega * r_1[0]];
    var v_2 = [collision.fixture_2.body.u - collision.fixture_2.body.omega * r_2[1], collision.fixture_2.body.v + collision.fixture_2.body.omega * r_2[0]];
    
    var v_rel = [v_2[0] - v_1[0], v_2[1] - v_1[1]];

    var v_rel_proj = v_rel[0] * collision.normal[0] + v_rel[1] * collision.normal[1]; 

    var r_1_x_n = r_1[0] * collision.normal[1] - r_1[1] * collision.normal[0];
    var r_2_x_n = r_2[0] * collision.normal[1] - r_2[1] * collision.normal[0];

    var body_1_inv_inertia = 1 / collision.fixture_1.body.m_inertia;
    var body_2_inv_inertia = 1 / collision.fixture_2.body.m_inertia;

    if(collision.fixture_1.body.static){body_1_inv_inertia = 0};
    if(collision.fixture_2.body.static){body_2_inv_inertia = 0};
    
    var r_1_x_n_x_r_1 = [body_1_inv_inertia * -r_1_x_n * r_1[1], body_1_inv_inertia * r_1_x_n * r_1[0]];
    var r_2_x_n_x_r_2 = [body_2_inv_inertia * -r_2_x_n * r_2[1], body_2_inv_inertia * r_2_x_n * r_2[0]];

    var m_inertia_sum = [r_1_x_n_x_r_1[0] + r_2_x_n_x_r_2[0], r_1_x_n_x_r_1[1] + r_2_x_n_x_r_2[1]];
    var inverse_rotational_mass = m_inertia_sum[0] * collision.normal[0] + m_inertia_sum[1] * collision.normal[1];
    
    var body_1_inv_mass = 1 / collision.fixture_1.body.mass;
    var body_2_inv_mass = 1 / collision.fixture_2.body.mass;

    if(collision.fixture_1.body.static){body_1_inv_mass = 0};
    if(collision.fixture_2.body.static){body_2_inv_mass = 0;};

    var denominator = body_1_inv_mass + body_2_inv_mass + inverse_rotational_mass;

    var impulse = Math.abs((1 + restitution) * v_rel_proj / denominator);

    var impulse_1 = [impulse * collision.normal[0], impulse * collision.normal[1]];
    var impulse_2 = [-impulse_1[[0]], -impulse_1[1]];
    var com_1_direction = -r_1[0] * collision.normal[0] - r_1[1] * collision.normal[1];
    var com_2_direction = -r_2[0] * collision.normal[0] - r_2[1] * collision.normal[1];
    if(com_1_direction < 0){
      impulse_1 = [-impulse_1[[0]], -impulse_1[1]];
      impulse_2 = [-impulse_2[[0]], -impulse_2[1]];
    }

    var v_1_direction = -v_rel[0] * collision.normal[0] - v_rel[1] * collision.normal[1];
    var v_2_direction = v_rel[0] * collision.normal[0] + v_rel[1] * collision.normal[1];
    if((v_1_direction < 0 && com_2_direction < 0 || v_1_direction > 0 && com_2_direction > 0) || (v_2_direction < 0 && com_1_direction < 0 || v_2_direction > 0 && com_1_direction > 0)){
      if(!collision.fixture_1.body.static){
        collision.fixture_1.body.applyImpulse(collision.location[0], collision.location[1], impulse_1[0], impulse_1[1]);
      }
      if(!collision.fixture_2.body.static){
        collision.fixture_2.body.applyImpulse(collision.location[0], collision.location[1], impulse_2[0], impulse_2[1]);
      }
    }else{
      var k_disp = 0.1; //constant to affect how much objects get displaced from one another
      if(com_1_direction > 0){
        if(!collision.fixture_1.body.static){collision.fixture_1.body.displace(k_disp * collision.normal[0], k_disp * collision.normal[1]);}
        if(!collision.fixture_2.body.static){collision.fixture_2.body.displace(k_disp * -collision.normal[0], k_disp * -collision.normal[1]);}
      }else{
        if(!collision.fixture_1.body.static){collision.fixture_1.body.displace(k_disp * -collision.normal[0], k_disp * -collision.normal[1]);}
        if(!collision.fixture_2.body.static){collision.fixture_2.body.displace(k_disp * collision.normal[0], k_disp * collision.normal[1]);}
      }
      impulse = 0;
    }
    var tangent = [-collision.normal[1], collision.normal[0]];
    var friction_impulse = [-impulse * friction * tangent[0], -impulse * friction * tangent[1]];
    var velocity_direction = (v_rel[0] * tangent[0] + v_rel[1] * tangent[1]);
    if(velocity_direction > 0){
      velocity_direction = 1;
    }else if(velocity_direction < 0){
      velocity_direction = -1;
    }else{
      velocity_direction = 0;
    }
    if(!collision.fixture_1.body.static){
      collision.fixture_1.body.applyImpulse(collision.location[0], collision.location[1], -velocity_direction * friction_impulse[0], -velocity_direction * friction_impulse[1]);
    }
    if(!collision.fixture_2.body.static){
      collision.fixture_2.body.applyImpulse(collision.location[0], collision.location[1], velocity_direction * friction_impulse[0], velocity_direction * friction_impulse[1]);
    }
  }
}