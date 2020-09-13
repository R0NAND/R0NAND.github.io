const canvas = document.querySelector("#swarmSim");
const gl = canvas.getContext("webgl");

gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

var vertex_shader_code = ['precision mediump float;',
                          'attribute vec3 vertPosition;',
                          'attribute vec3 vertNormal;',
                          'uniform mat4 worldMatrix;',
                          'uniform mat4 viewMatrix;',
                          'uniform mat4 projectionMatrix;',
                          'varying vec3 frag_normal;',
                          'void main(){',
                          'gl_Position = projectionMatrix * viewMatrix * worldMatrix * vec4(vertPosition, 1.0);',
                          'frag_normal = mat3(worldMatrix) * vertNormal;',
                          '}'].join('\n');

var fragment_shader_code = ['precision mediump float;',
                            'varying vec3 frag_normal;',
                            'uniform vec4 color;', 
                            'void main(){',
                            'float intensity = dot(vec3(0.0, 1.0, 0.0), frag_normal);',
                            'gl_FragColor = vec4(color[0] + 0.25 * intensity, color[1] + 0.25 * intensity, color[2] + 0.25 * intensity, 1.0);',
                            '}'].join('\n');

var vertex_shader = gl.createShader(gl.VERTEX_SHADER);
var fragment_shader = gl.createShader(gl.FRAGMENT_SHADER);

gl.shaderSource(vertex_shader, vertex_shader_code);
gl.shaderSource(fragment_shader, fragment_shader_code);

gl.compileShader(vertex_shader);
if(!gl.getShaderParameter(vertex_shader, gl.COMPILE_STATUS)){
  console.error('AAAHHH! vertex shader did not compile:', gl.getShaderInfoLog(vertex_shader));
}
gl.compileShader(fragment_shader);
if(!gl.getShaderParameter(fragment_shader, gl.COMPILE_STATUS)){
  console.error('AAAHHH! fragment shader did not compile:', gl.getShaderInfoLog(fragment_shader));
}

var program = gl.createProgram();
gl.attachShader(program, vertex_shader);
gl.attachShader(program, fragment_shader);
gl.linkProgram(program);

var boid_mesh = [-4.0, 3.0, -6.0, 0.0, 0.0, -4.0, 0.0, 0.0, 6.0,
                 4.0, 3.0, -6.0, 0.0, 0.0, -4.0, 0.0, 0.0, 6.0];
var wing_normals = [3 / Math.sqrt(5), 4 / Math.sqrt(5), 0,
                    -3 / Math.sqrt(5), 4 / Math.sqrt(5), 0];

var buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boid_mesh), gl.STATIC_DRAW);

var position_attribute_location = gl.getAttribLocation(program, 'vertPosition');
gl.vertexAttribPointer(position_attribute_location, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
gl.enableVertexAttribArray(position_attribute_location);

var normal_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, normal_buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(wing_normals), gl.STATIC_DRAW);

var normal_attribute_location = gl.getAttribLocation(program, 'vertNormal');
gl.vertexAttribPointer(normal_attribute_location, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
gl.enableVertexAttribArray(normal_attribute_location);


gl.useProgram(program);

var view_matrix_uniform_location = gl.getUniformLocation(program, 'viewMatrix');
var world_matrix_uniform_location = gl.getUniformLocation(program, 'worldMatrix');
var projection_matrix_uniform_location = gl.getUniformLocation(program, 'projectionMatrix');

var view_matrix = new Float32Array(16);
var projection_matrix = new Float32Array(16);
var world_matrix = new Float32Array(16);

var timestep = 1 / 60;
var swarm = new Swarm(100);
var colors = [];
for(var i = 0; i < 100; i++){
  colors.push(glMatrix.vec4.fromValues(0.75 * Math.random(), 0.5 + 0.25 * Math.random(), 0.5 * Math.random(), 1,0));
}

var color_location = gl.getUniformLocation(program, 'color');

glMatrix.mat4.lookAt(view_matrix, [0, -100, -200], [-1, 0, 0], [0, 1, 0]);
glMatrix.mat4.perspective(projection_matrix, 1.5, canvas.width / canvas.height, 1, 1000);

gl.uniformMatrix4fv(view_matrix_uniform_location, gl.FALSE, view_matrix);
gl.uniformMatrix4fv(projection_matrix_uniform_location, gl.FALSE, projection_matrix);

gl.enable(gl.DEPTH_TEST);
function updateAndDraw(){
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  swarm.step(timestep);
  for(var i = 0; i < swarm.size; i++){
    var world_matrix = new Float32Array(16);
    glMatrix.mat4.fromTranslation(world_matrix, swarm.boids[i].location);
    var y_angle = Math.atan2(swarm.boids[i].velocity[0], swarm.boids[i].velocity[2]);
    glMatrix.mat4.rotateY(world_matrix, world_matrix, y_angle);
    var pitch_axis = glMatrix.vec3.fromValues(Math.cos(y_angle + Math.PI / 2), 0, Math.sin(y_angle + Math.PI / 2));
    var pitch_angle = Math.atan2(swarm.boids[i].velocity[2], Math.sqrt(Math.pow(swarm.boids[i].velocity[0], 2) + Math.pow(swarm.boids[i].velocity[1], 2)));
    glMatrix.mat4.rotate(world_matrix, world_matrix, pitch_angle, pitch_axis);
    gl.uniformMatrix4fv(world_matrix_uniform_location, gl.FALSE, world_matrix);
    gl.uniform4fv(color_location, colors[i]);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  requestAnimationFrame(updateAndDraw);
}

updateAndDraw();
