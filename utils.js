function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

function setAttributeLoc(gl, program, attributeName) {
  const location = gl.getAttribLocation(program, attributeName);

  const elementPerVertex = 2;
  const type = gl.FLOAT;
  const normalize = gl.FALSE;
  const stride = 2 * Float32Array.BYTES_PER_ELEMENT;
  const offset = 0;

  gl.vertexAttribPointer(
    location,
    elementPerVertex,
    type,
    normalize,
    stride,
    offset
  );

  gl.enableVertexAttribArray(location);
}

function setMat4UniformLoc(gl, program, attributeName, matrix) {
  const location = gl.getUniformLocation(program, attributeName);
  gl.uniformMatrix4fv(location, false, matrix);
}
