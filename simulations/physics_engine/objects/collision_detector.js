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
      if(!this.aabb_tree_leafs[i].doesItFit(this.objects[i].shape.generateAABB(this.objects[i].body.position, this.objects[i].body.theta))){
        this.collision_tree.remove(this.aabb_tree_leafs[i]);
        var new_aabb = this.objects[i].shape.generateAABB(this.objects[i].body.position, this.objects[i].body.theta);
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
        collisions.push(new CollisionManifold(candidates[i][0], candidates[i][1], collision_result[0], collision_result[1], collision_result[2]));
      }
    }
    return collisions;
  }

  doTheyCollide(fixture_1, fixture_2){
    if(fixture_1.shape instanceof CircleShape){
      if(fixture_2.shape instanceof CircleShape){
        return this.detectCollisionCircleCircle(fixture_1.shape, fixture_1.body.position, fixture_2.shape, fixture_2.body.position);
      }else if(fixture_2.shape instanceof PolygonShape){
        return this.detectCollisionPolygonCircle(fixture_2.shape, fixture_2.body.position, fixture_2.body.theta, fixture_1.shape, fixture_1.body.position);
      }
    }else if(fixture_1.shape instanceof PolygonShape){
      if(fixture_2.shape instanceof CircleShape){
        return this.detectCollisionPolygonCircle(fixture_1.shape, fixture_1.body.position, fixture_1.body.theta, fixture_2.shape, fixture_2.body.position);
      }else if(fixture_2.shape instanceof PolygonShape){
        return this.detectCollisionPolygonPolygon(fixture_1.shape, fixture_1.body.position, fixture_1.body.theta, fixture_2.shape, fixture_2.body.position, fixture_2.body.theta);
      }
    }
  }
  
  detectCollisionCircleCircle(circle_1, position_1, circle_2, position_2){ 
    var location_1 = Vec2.add(position_1, circle_1.position);
    var location_2 = Vec2.add(position_2, circle_2.position);
    var relative_position = Vec2.subtract(location_2, location_1);
    var distance = Vec2.magnitude(relative_position);
    if(distance <= circle_1.r + circle_2.r){
      var collision_coordinates = Vec2.add(location_1, Vec2.divide(relative_position, 2));
      var collision_normal = Vec2.divide(relative_position, distance);
      var penetration = circle_1.r + circle_2.r - distance;
      return [collision_coordinates, collision_normal, penetration];
    }else{
      return null;
    }
  }

  detectCollisionPolygonPolygon(polygon_1, position_1, theta_1, polygon_2, position_2, theta_2){
    var polygon_1_points = [];
    var polygon_2_points = [];
    for(var i = 0; i < polygon_1.vertices.length; i++){
      var point = Vec2.add(position_1, Vec2.rotate(polygon_1.vertices[i], theta_1));
      polygon_1_points.push(point);
    }
    for(var i = 0; i < polygon_2.vertices.length; i++){
      var point = Vec2.add(position_2, Vec2.rotate(polygon_2.vertices[i], theta_2));
      polygon_2_points.push(point);
    }
    var normals = [];
    for(var i = 0; i < polygon_1_points.length - 1; i++){
      normals.push(Vec2.getNormal(Vec2.subtract(polygon_1_points[i + 1], polygon_1_points[i])));
    }
    normals.push(normals.push(Vec2.getNormal(Vec2.subtract(polygon_1_points[0], polygon_1_points[polygon_1_points.length - 1]))));
    for(var i = 0; i < polygon_2_points.length - 1; i++){
      normals.push(Vec2.getNormal(Vec2.subtract(polygon_2_points[i + 1], polygon_2_points[i])));
    }
    normals.push(normals.push(Vec2.getNormal(Vec2.subtract(polygon_2_points[0], polygon_2_points[polygon_2_points.length - 1]))));
    var min_penetration = Infinity;
    var penetration_normal;
    var collision_point;
    for(var n = 0; n < normals.length; n++){
      var polygon_1_min = Vec2.dotProduct(normals[n], polygon_1_points[0]);
      var polygon_1_max = polygon_1_min;
      var polygon_1_contact_min = polygon_1_points[0];
      var polygon_1_contact_max = polygon_1_points[0];
      for (var p = 1; p < polygon_1_points.length; p++){
        var point = Vec2.dotProduct(normals[n], polygon_1_points[p]);
        if(point > polygon_1_max){polygon_1_max = point; polygon_1_contact_max = polygon_1_points[p]}
        if(point < polygon_1_min){polygon_1_min = point; polygon_1_contact_min = polygon_1_points[p]}
      }
      var polygon_2_min = Vec2.dotProduct(normals[n], polygon_2_points[0]);
      var polygon_2_max = polygon_2_min;
      var polygon_2_contact_min = polygon_2_points[0];
      var polygon_2_contact_max = polygon_2_points[0];
      for (var p = 1; p < polygon_2_points.length; p++){
        var point = Vec2.dotProduct(normals[n], polygon_2_points[p]);
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
    return [collision_point, penetration_normal, min_penetration];
  }

  detectCollisionPolygonCircle(polygon, poly_pos, theta_p, circle, circle_pos){
    var circle_location = Vec2.add(circle_pos, circle.position);
    var polygon_points = [];
    for(var i = 0; i < polygon.vertices.length; i++){
      var point = Vec2.add(poly_pos, Vec2.rotate(polygon.vertices[i], theta_p));
      polygon_points.push(point);
    }
    //check if polygon point is within circle radius
    for(var p = 0; p < polygon_points.length; p++){
      var relative_position = Vec2.subtract(polygon_points[p], circle_pos);
      var distance = Vec2.magnitude(relative_position);
      if (distance < circle.r){
        return [polygon_points[p], Vec2.divide(relative_position, distance), circle.r - distance];
      } 
    }
    var normals = [];
    for(var i = 0; i < polygon_points.length - 1; i++){
      normals.push(Vec2.getNormal(Vec2.subtract(polygon_points[i+1], polygon_points[i])));
    }
    normals.push(Vec2.getNormal(Vec2.subtract(polygon_points[0], polygon_points[polygon_points.length - 1])));
    var min_penetration = Infinity;
    var penetration_normal;
    var collision_point;
    for(var n = 0; n < normals.length; n++){
      var polygon_min = Vec2.dotProduct(normals[n], polygon_points[0]); //figure out better way
      var polygon_max = Vec2.dotProduct(normals[n], polygon_points[0]);
      for (var p = 1; p < polygon_points.length; p++){
        var point = Vec2.dotProduct(normals[n], polygon_points[p]);
        if(point > polygon_max){polygon_max = point}
        if(point < polygon_min){polygon_min = point}
      }
      var circle_min = Vec2.dotProduct(normals[n], circle_location) - circle.r; 
      var circle_max = Vec2.dotProduct(normals[n], circle_location) + circle.r;
      if(circle_min > polygon_max || circle_max < polygon_min){
        return null;
      }else{
        var relative_position = Vec2.subtract(circle_location, poly_pos);
        if(circle_max > polygon_max && circle_min < polygon_max){
          var penetration_depth = polygon_max - circle_min;
          if(penetration_depth < min_penetration && Vec2.dotProduct(normals[n], relative_position) > 0){
            min_penetration = penetration_depth;
            penetration_normal = normals[n];
            collision_point = Vec2.subtract(circle_location, Vec2.multiply(penetration_normal, circle.r));
          }
        }else if(circle_min < polygon_min && circle_max > polygon_min){
          var penetration_depth = circle_max - polygon_min;
          if(penetration_depth < min_penetration && Vec2.dotProduct(normals[n], relative_position) > 0){
            min_penetration = penetration_depth;
            penetration_normal = normals[n];
            collision_point = Vec2.subtract(circle_location, Vec2.multiply(penetration_normal, circle.r));
          }
        }
      }
    }
    return [collision_point, penetration_normal, min_penetration];
  }

  draw(ctx){
    this.collision_tree.draw(ctx, this.collision_tree.root, 0);
  }
}

