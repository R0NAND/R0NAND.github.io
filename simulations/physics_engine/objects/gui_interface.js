class GuiInterface{//kinda redundant name I know :p
  constructor(canvas, shape, size, density, restitution, friction, is_static){
    this.canvas = canvas
    this.shape_buttons = shape;
    this.size_slider = size;
    this.density_slider = density;
    this.restitution_slider = restitution;
    this.friction_slider = friction;
    this.static_check = is_static;
    
    this.mousePos = [0, 0];
    this.shape = null;
    this.holding = false;
    this.new_body = false;
  }

  drawShape(){
    var size = 0.3 * document.getElementById(this.size_slider).value;

    var shapes = document.getElementsByName(this.shape_buttons);
    var shape_value;
    for(var i = 0; i < shapes.length; i++){
      if(shapes[i].checked){
        shape_value = shapes[i].value;
      } 
    }
    if(shape_value == "circle"){
      this.shape = new CircleShape(0, 0, size / 2);
    }else if(shape_value == "square"){
      this.shape = new PolygonShape([[0,0], [size, 0], [size, size], [0, size]]);
    }else if(shape_value == "triangle"){
      this.shape = new PolygonShape([[0,0], [size, 0], [size/2, size * 0.866]]);
    }
    this.shape.draw(this.canvas, 30, 30, 0);
  }

  generateBody(){
    var new_body_fixture = new Fixture(this.shape, 0.01 * document.getElementById(this.density_slider).value,
                                                 0.01 * document.getElementById(this.friction_slider).value, 
                                                 0.01 * document.getElementById(this.restitution_slider).value); 
    var new_body = new RigidBody(30, 30, 0, 0, 0, 0);
    new_body.addFixture(new_body_fixture);
    this.new_body = false;
    this.holding = true;
    return new_body;
  }

  static onClick(event){
    if(mousePos[0] < 50 && mousePos[1] < 50){
      clicked = true;
    }
  }

  static onMove(event){
    mousePos[0] = event.clientX - canvas.offsetLeft;
    mousePos[1] = event.clientY - canvas.offsetTop;;
  }

  static onUp(event){
    if(held == true){
      held = false;
      released = true;
    }
  }
}