class Spring{
  constructor(body_1, location_1, body_2, location_2, stiffness, damping){
    this.body_1 = body_1;
    if(this.body_1){
      this.location_1 = [[Math.cos(-body_1.theta) * (location_1[0] - body_1.x) - Math.sin(-body_1.theta) * (location_1[1] - body_1.y)], 
                         [Math.sin(-body_1.theta) * (location_1[0] - body_1.x) + Math.cos(-body_1.theta) * (location_1[1] - body_1.y)]];
    }else{
      this.location_1 = location_1;
    }
    this.body_2 = body_2;
    if(this.body_2){
      this.location_2 = [[Math.cos(-body_2.theta) * (location_2[0] - body_2.x) - Math.sin(-body_2.theta) * (location_2[1] - body_2.y)], 
                         [Math.sin(-body_2.theta) * (location_1[0] - body_2.x) + Math.cos(-body_2.theta) * (location_2[1] - body_2.y)]];
    }else{
      this.location_2 = location_2;
    }
    this.stiffness = stiffness;
    this.damping = damping;
    this.length = Math.sqrt(Math.pow((location_1[0] - location_2[0]), 2) + Math.pow((location_1[1] - location_2[1]), 2));

    this.previous_location_1 = location_1;
    this.previous_location_2 = location_2;
  }

  step(dt){
    var end_1;
    var end_2;

    if(this.body_1){
      end_1 = [[this.body_1.x + Math.cos(this.body_1.theta) * this.location_1[0] - Math.sin(this.body_1.theta) * this.location_1[1]],
               [this.body_1.y + Math.sin(this.body_1.theta) * this.location_1[0] + Math.cos(this.body_1.theta) * this.location_1[1]]];
    }else{
      end_1 = this.location_1;
    }

    if(this.body_2){
      end_2 = [[this.body_2.x + Math.cos(this.body_2.theta) * this.location_2[0] - Math.sin(this.body_2.theta) * this.location_2[1]],
               [this.body_2.y + Math.sin(this.body_2.theta) * this.location_2[0] + Math.cos(this.body_2.theta) * this.location_2[1]]];
    }else{
      end_2 = this.location_2;
    }

    var distance = Math.sqrt(Math.pow((end_1[0] - end_2[0]), 2) + Math.pow((end_1[1] - end_2[1]), 2));
    var delta_length = distance - this.length;
    var force = this.stiffness * delta_length;
    var force_vector;
    if(distance != 0){
      force_vector = [[(end_2[0] - end_1[0]) / distance], [(end_2[1] - end_1[1]) / distance]];
    }else{
      force_vector = [0, 0]
    }
    if(this.body_1){
      this.body_1.applyForce(end_1[0], end_1[1], force * force_vector[0], force * force_vector[1], dt);
    }
    if(this.body_2){
      this.body_2.applyForce(end_2[0], end_2[1], -force * force_vector[0], -force * force_vector[1], dt);
    }
  }

  draw(canvas){
    var end_1;
    var end_2;
    if(this.body_1){
      end_1 = [[this.body_1.x + Math.cos(this.body_1.theta) * this.location_1[0] - Math.sin(this.body_1.theta) * this.location_1[1]],
               [this.body_1.y + Math.sin(this.body_1.theta) * this.location_1[0] + Math.cos(this.body_1.theta) * this.location_1[1]]];
    }else{
      end_1 = this.location_1;
    }

    if(this.body_2){
      end_2 = [[this.body_2.x + Math.cos(this.body_2.theta) * this.location_2[0] - Math.sin(this.body_2.theta) * this.location_2[1]],
               [this.body_2.y + Math.sin(this.body_2.theta) * this.location_2[0] + Math.cos(this.body_2.theta) * this.location_2[1]]];
    }else{
      end_2 = this.location_2;
    }

    canvas.strokeStyle = "black";
    canvas.beginPath();
    canvas.moveTo(end_1[0], end_1[1]);
    canvas.lineTo(end_2[0], end_2[1]);
    canvas.stroke();
  }
}