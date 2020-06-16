class CollisionHandler{
  static detectCircleWall(circle, wall, dt){
    var wall_normal = Math.atan2((wall.y_2 - wall.y_1), (wall.x_2 - wall.x_1)) + Math.PI / 2;
    var initial_side_1 = wall.side(circle.x + circle.r*Math.cos(wall_normal), 
                                   circle.y + circle.r*Math.sin(wall_normal));
    var initial_side_2 = wall.side(circle.x + circle.r*Math.cos(wall_normal + Math.PI), 
                                   circle.y + circle.r*Math.sin(wall_normal + Math.PI));
    var stepped_side_1 = wall.side(circle.x + circle.u * dt + circle.r*Math.cos(wall_normal), 
                                   circle.y + circle.v * dt + circle.r*Math.sin(wall_normal));
    var stepped_side_2 = wall.side(circle.x + circle.u * dt + circle.r*Math.cos(wall_normal + Math.PI), 
                                   circle.y + circle.v * dt + circle.r*Math.sin(wall_normal + Math.PI));
    var direction = wall.direction(circle.x, circle.y, circle.x + circle.u * dt, circle.y + circle.v * dt);
    if (direction && (initial_side_1 != stepped_side_1) || (initial_side_2 != stepped_side_2)){
      var impulse = -1.5 * (circle.u * Math.cos(wall_normal) + circle.v * Math.sin(wall_normal)) * circle.m;
      var impulse_x = impulse * Math.cos(wall_normal);
      var impulse_y = impulse * Math.sin(wall_normal);
      circle.applyImpulse(impulse_x, impulse_y);
    }else if(direction && initial_side_1 != initial_side_2){
      circle.applyImpulse(0, 10);
    }
  }
  static CircleCircle(circle_1, circle_2){
    var x_distance = (circle_1.x - circle_2.x);
    var y_distance = (circle_1.y - circle_2.y);
    var x_distance_stepped = ((circle_1.x + circle_1.u*dt) - (circle_2.x + circle_2.u * dt));
    var y_distance_stepped = ((circle_1.y + circle_1.v*dt) - (circle_2.y + circle_2.v * dt));
    if((x_distance_stepped * x_distance_stepped + y_distance_stepped * y_distance_stepped) < (x_distance * x_distance + y_distance * y_distance)){
      var collision_normal = Math.atan2(y_distance, x_distance);
      var v_normal_1 = Math.cos(collision_normal) * circle_1.u + Math.sin(collision_normal) * circle_1.v;
      var v_normal_2 = Math.cos(collision_normal) * circle_2.u + Math.sin(collision_normal) * circle_2.v;
      var mass_sum = circle_1.m + circle_2.m;
      var mass_difference = circle_1.m - circle_2.m;
      var exit_v_normal_1 = (mass_difference / mass_sum) * v_normal_1 + (2 * circle_2.m / mass_sum) * v_normal_2;
      var exit_v_normal_2 = (-mass_difference / mass_sum) * v_normal_2 + (2 * circle_1.m / mass_sum) * v_normal_1;
      circle_1.u += (exit_v_normal_1 - v_normal_1) * Math.cos(collision_normal);
      circle_1.v += (exit_v_normal_1 - v_normal_1) * Math.sin(collision_normal);
      circle_2.u += (exit_v_normal_2 - v_normal_2) * Math.cos(collision_normal);
      circle_2.v += (exit_v_normal_2 - v_normal_2) * Math.sin(collision_normal);
    }
  }
}