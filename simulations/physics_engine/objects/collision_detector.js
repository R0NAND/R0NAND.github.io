class CollisionDetector{
  constructor(){
      this.collision_tree = new AABBTree();
      this.objects = [];
      this.aabb_tree_leafs = [];
      this.box_buffer = 5;
  }

  add(aabb, fixture){
    this.objects.push(fixture);
    aabb.fatten(this.box_buffer);
    this.aabb_tree_leafs.push(this.collision_tree.insert(aabb, fixture));
  }

  update(){
    for(var i = 0; i < this.objects.length; i++){
      if(!this.aabb_tree_leafs[i].doesItFit(this.objects[i].shape.generateAABB(this.objects[i].body.x, this.objects[i].body.y, this.objects[i].body.theta))){
        this.collision_tree.remove(this.aabb_tree_leafs[i]);
        var new_aabb = this.objects[i].shape.generateAABB(this.objects[i].body.x, this.objects[i].body.y, this.objects[i].body.theta);
        new_aabb.fatten(this.box_buffer);
        this.aabb_tree_leafs[i] = this.collision_tree.insert(new_aabb, this.objects[i]);
      }
    }
  }

  getCollisions(){
    var candidates = this.collision_tree.getCollisionsList();
    var collisions = [];
    for(var i = 0; i < candidates.length; i++){
      var collision_result = this.doTheyCollide(candidates[i][0], candidates[i][1]);
      if(collision_result){
        collisions.push(new CollisionManifold(candidates[i][0], candidates[i][1], collision_result[0], collision_result[1]));
      }
    }
    return collisions;
  }

  doTheyCollide(fixture_1, fixture_2){
    if(fixture_1.shape instanceof CircleShape){
      if(fixture_2.shape instanceof CircleShape){
        return this.detectCollisionCircleCircle(fixture_1.shape, fixture_1.body.x, fixture_1.body.y, fixture_2.shape, fixture_2.body.x, fixture_2.body.y);
      }else if(fixture_2.shape instanceof PolygonShape){
        return this.detectCollisionPolygonCircle(fixture_2.shape, fixture_2.body.x, fixture_2.body.y, fixture_2.body.theta, fixture_1.shape, fixture_1.body.x, fixture_1.body.y);
      }
    }else if(fixture_1.shape instanceof PolygonShape){
      if(fixture_2.shape instanceof CircleShape){
        return this.detectCollisionPolygonCircle(fixture_1.shape, fixture_1.body.x, fixture_1.body.y, fixture_1.body.theta, fixture_2.shape, fixture_2.body.x, fixture_2.body.y);
      }else if(fixture_2.shape instanceof PolygonShape){
        return this.detectCollisionPolygonPolygon(fixture_1.shape, fixture_1.body.x, fixture_1.body.y, fixture_1.body.theta, 
                                                  fixture_2.shape, fixture_2.body.x, fixture_2.body.y, fixture_2.body.theta);
      }
    }
  }
  
  detectCollisionCircleCircle(circle_1, x_1, y_1, circle_2, x_2, y_2){ 
    var circle_1_x = x_1 + circle_1.x;
    var circle_1_y = y_1 + circle_1.y;
    var circle_2_x = x_2 + circle_2.x;
    var circle_2_y = y_2 + circle_2.y;  

    var x_distance = circle_2_x - circle_1_x;
    var y_distance = circle_2_y - circle_1_y;
    var distance = Math.sqrt(x_distance * x_distance + y_distance * y_distance);
    if(distance <= circle_1.r + circle_2.r){
      var collision_coordinates = [circle_1_x + x_distance / 2, circle_1_y + y_distance / 2];
      var collision_normal = [x_distance /distance, y_distance / distance];
      return [collision_coordinates, collision_normal];
    }else{
      return null;
    }
  }

  detectCollisionPolygonPolygon(polygon_1, x_1, y_1, theta_1, polygon_2, x_2, y_2, theta_2){
    var polygon_1_points = [];
    var polygon_2_points = [];
    for(var i = 0; i < polygon_1.vertices.length; i++){
      var x = x_1 + polygon_1.vertices[i][0] * Math.cos(theta_1) - polygon_1.vertices[i][1] * Math.sin(theta_1);
      var y = y_1 + polygon_1.vertices[i][0] * Math.sin(theta_1) + polygon_1.vertices[i][1] * Math.cos(theta_1);
      polygon_1_points.push([x, y]);
    }
    for(var i = 0; i < polygon_2.vertices.length; i++){
      var x = x_2 + polygon_2.vertices[i][0] * Math.cos(theta_2) - polygon_2.vertices[i][1] * Math.sin(theta_2);
      var y = y_2 + polygon_2.vertices[i][0] * Math.sin(theta_2) + polygon_2.vertices[i][1] * Math.cos(theta_2);
      polygon_2_points.push([x, y]);
    }

    var normals = [];
    for(var i = 0; i < polygon_1_points.length - 1; i++){
      normals.push(this.getNormal(polygon_1_points[i][0], polygon_1_points[i][1], polygon_1_points[i+1][0], polygon_1_points[i+1][1]));
    }
    normals.push(this.getNormal(polygon_1_points[polygon_1_points.length - 1][0], polygon_1_points[polygon_1_points.length - 1][1], polygon_1_points[0][0], polygon_1_points[0][1]));
    for(var i = 0; i < polygon_2_points.length - 1; i++){
      normals.push(this.getNormal(polygon_2_points[i][0], polygon_2_points[i][1], polygon_2_points[i+1][0], polygon_2_points[i+1][1]));
    }
    normals.push(this.getNormal(polygon_2_points[polygon_2_points.length - 1][0], polygon_2_points[polygon_2_points.length - 1][1], polygon_2_points[0][0], polygon_2_points[0][1]));
    var min_penetration = Infinity;
    var penetration_normal;
    var collision_point;

    for(var n = 0; n < normals.length; n++){
      var polygon_1_min = normals[n][0] * polygon_1_points[0][0] + normals[n][1] * polygon_1_points[0][1]; 
      var polygon_1_max = polygon_1_min;
      var polygon_1_contact_min = polygon_1_points[0];
      var polygon_1_contact_max = polygon_1_points[0];
      for (var p = 1; p < polygon_1_points.length; p++){
        var point = normals[n][0] * polygon_1_points[p][0] + normals[n][1] * polygon_1_points[p][1];
        if(point > polygon_1_max){polygon_1_max = point; polygon_1_contact_max = polygon_1_points[p]}
        if(point < polygon_1_min){polygon_1_min = point; polygon_1_contact_min = polygon_1_points[p]}
      }
      var polygon_2_min = normals[n][0] * polygon_2_points[0][0] + normals[n][1] * polygon_2_points[0][1]; 
      var polygon_2_max = polygon_2_min;
      var polygon_2_contact_min = polygon_2_points[0];
      var polygon_2_contact_max = polygon_2_points[0];
      for (var p = 1; p < polygon_2_points.length; p++){
        var point = normals[n][0] * polygon_2_points[p][0] + normals[n][1] * polygon_2_points[p][1];
        if(point > polygon_2_max){polygon_2_max = point; polygon_2_contact_max = polygon_2_points[p];}
        if(point < polygon_2_min){polygon_2_min = point; polygon_2_contact_min = polygon_2_points[p];}
      }
      if(polygon_2_min > polygon_1_max || polygon_2_max < polygon_1_min){
        return null;
      }else{
        if(polygon_2_max > polygon_1_max && polygon_2_min < polygon_1_max){
          var penetration_depth = polygon_1_max - polygon_2_min;
          if(penetration_depth < min_penetration){
            if(n < polygon_1.vertices.length){
              min_penetration = penetration_depth;
              penetration_normal = normals[n];
              collision_point = polygon_2_contact_min;
            }else{
              min_penetration = penetration_depth;
              penetration_normal = normals[n];
              collision_point = polygon_1_contact_max;
            }
          }
        }else if(polygon_2_min < polygon_1_min && polygon_2_max > polygon_1_min){
          var penetration_depth = polygon_2_max - polygon_1_min;
          if(penetration_depth < min_penetration){
            if(n < polygon_1.vertices.length){
              min_penetration = penetration_depth;
              penetration_normal = normals[n];
              collision_point = polygon_2_contact_max;
            }else{
              min_penetration = penetration_depth;
              penetration_normal = normals[n];
              collision_point = polygon_1_contact_min;
            }
          }
        }
      }
    }
    console.log(collision_point);
    return [collision_point, penetration_normal]
  }

  detectCollisionPolygonCircle(polygon, x_p, y_p, theta_p, circle, x_c, y_c){
    var circle_x = x_c + circle.x;
    var circle_y = y_c + circle.y;
    var polygon_points = [];
    for(var i = 0; i < polygon.vertices.length; i++){
      var x = x_p + polygon.vertices[i][0] * Math.cos(theta_p) - polygon.vertices[i][1] * Math.sin(theta_p);
      var y = y_p + polygon.vertices[i][0] * Math.sin(theta_p) + polygon.vertices[i][1] * Math.cos(theta_p);
      polygon_points.push([x, y]);
    }
    //check if polygon point is within circle radius
    for(var p = 0; p < polygon_points.length; p++){
      var x_distance = polygon_points[p][0] - circle_x;
      var y_distance = polygon_points[p][1] - circle_y;
      var distance = Math.sqrt(Math.pow(x_distance, 2) + Math.pow(y_distance, 2));
      if (distance < circle.r){
        return [polygon_points[p], [x_distance / distance, y_distance / distance]];
      } 
    }

    var normals = [];
    for(var i = 0; i < polygon_points.length - 1; i++){
      normals.push(this.getNormal(polygon_points[i][0], polygon_points[i][1], polygon_points[i+1][0], polygon_points[i+1][1]));
    }
    normals.push(this.getNormal(polygon_points[polygon_points.length - 1][0], polygon_points[polygon_points.length - 1][1], polygon_points[0][0], polygon_points[0][1]));
    
    var min_penetration = Infinity;
    var penetration_normal;
    var collision_point;

    for(var n = 0; n < normals.length; n++){
      console.log(normals[n]);
      var polygon_min = normals[n][0] * polygon_points[0][0] + normals[n][1] * polygon_points[0][1]; 
      var polygon_max = polygon_min;
      for (var p = 1; p < polygon_points.length; p++){
        var point = normals[n][0] * polygon_points[p][0] + normals[n][1] * polygon_points[p][1];
        if(point > polygon_max){polygon_max = point}
        if(point < polygon_min){polygon_min = point}
      }
      var circle_min = normals[n][0] * circle_x + normals[n][1] * circle_y - circle.r; 
      var circle_max = normals[n][0] * circle_x + normals[n][1] * circle_y + circle.r;
      if(circle_min > polygon_max || circle_max < polygon_min){
        return null;
      }else{
        if(circle_max > polygon_max && circle_min < polygon_max){
          var penetration_depth = polygon_max - circle_min;
          if(penetration_depth < min_penetration && normals[n][0] * (circle_x - x_p) + normals[n][1] * (circle_y - y_p) > 0){
            min_penetration = penetration_depth;
            penetration_normal = normals[n];
            collision_point = [circle_x - circle.r * penetration_normal[0], circle_y - circle.r * penetration_normal[1]];
          }
        }else if(circle_min < polygon_min && circle_max > polygon_min){
          var penetration_depth = circle_max - polygon_min;
          if(penetration_depth < min_penetration && normals[n][0] * (circle_x - x_p) + normals[n][1] * (circle_y - y_p) > 0){
            min_penetration = penetration_depth;
            penetration_normal = normals[n];
            collision_point = [circle_x - circle.r * penetration_normal[0], circle_y - circle.r * penetration_normal[1]];
          }
        }
      }
    }
    return [collision_point, penetration_normal];
  }

  getNormal(x_1, y_1, x_2, y_2){
    var x_distance = x_2 - x_1;
    var y_distance = y_2 - y_1;
    var magnitude = Math.sqrt(x_distance * x_distance + y_distance * y_distance);
    var normal = [x_distance * Math.cos(-Math.PI / 2) - y_distance * Math.sin(-Math.PI / 2), x_distance * Math.sin(-Math.PI / 2) + y_distance * Math.cos(-Math.PI / 2)];
    normal[0] /= magnitude;
    normal[1] /= magnitude;
    return(normal);
  }

  draw(ctx){
    this.collision_tree.draw(ctx, this.collision_tree.root, 0);
  }



  detectCollision(){

  }
}

