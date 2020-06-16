class Aether{
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.density = 1;
    this.mass = 1;
    this.stiffness = 1000;
    this.damping = 0;
    this.field = new Array(x);

    for (var i = 0; i < y; i++){
      this.field[i] = new Array(y);
    }

    for (var i = 0; i < x; i++){
      for (var j = 0; j < y; j++){
        this.field[i][j] = {h:0, v:0, f:0};
      }
    }
    this.field[25][25].v = 5;
    this.field[25][75].v = 5;
    this.field[75][25].v = 5;
    this.field[75][75].v = 5;
    this.field[50][50].v = 5;
  }
  
  step(){
    for (var i = 1; i < this.x - 1; i++){
      for (var j = 1; j < this.y - 1; j++){
        this.field[i][j].f = this.stiffness *( -4 * this.field[i][j].h + 
                             this.field[(i+1)%this.x][j].h + 
                             this.field[(i-1)%this.x][j].h + 
                             this.field[i][(j+1)%this.y].h + 
                             this.field[i][(j-1)%this.y].h)
                             - this.field[i][j].v * this.damping;
      }
    }
    for (var i = 1; i < this.x - 1; i++){
      for (var j = 1; j < this.y - 1; j++){
        this.field[i][j].v += this.field[i][j].f / this.density / 60;
        this.field[i][j].h += this.field[i][j].v / 60; 
      }
    }
  }

  draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < this.x; i++){
      for (var j = 0; j < this.y; j++){
        ctx.fillStyle = 'rgb(' + Math.floor(this.field[i][j].h*10000 + 125) + ', ' 
                               + Math.floor(this.field[i][j].h*10000 + 125) + ', '
                               + Math.floor(this.field[i][j].h*10000 + 125) + ')';
        ctx.beginPath();
        ctx.rect(i*4, j*4, i*4 + 4, j*4 + 4);
        ctx.fill();
      }
    }
  }
}