const vertexShaderSource = `
attribute vec2 vertexPoint;
attribute vec3 vertexColor;

varying vec3 fragColor;

void main() {
    fragColor = vertexColor;
    gl_Position = vec4(vertexPoint, 0.0, 1.0);
}
`;

const fragmentShaderSource = `
precision mediump float;

varying vec3 fragColor;

void main() {
    gl_FragColor = vec4(fragColor, 1.0);
}
`;

/**
 * @description Create vertex or fragment shader
 * @param {WebGLRenderingContext} gl 
 * @param {GLenum} type - gl.VERTEX_SHADER or gl.FRAGMENT_SHADER 
 * @param {string} source
 */
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

/**
 * @description Create openGL program
 * @param {WebGLRenderingContext} gl 
 * @param {WebGLShader} vertexShader
 * @param {WebGLShader} fragmentShader
 */
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

/**
 * @description Set attribute location for vertex shader
 * @param {string} attributeName
 * @param {integer} elementPerVertex
 * @param {integer} offset
 * @param {integer} stride
 * @param {GLenum} type
 * @param {GLenum} normalize
 */
function setAttributeLoc(gl, program, attributeName,
    elementPerVertex = 2, 
    offset = 0,
    stride = 5, 
    type = gl.FLOAT, 
    normalize = gl.FALSE,
) {
  const location = gl.getAttribLocation(program, attributeName);

  stride = stride * Float32Array.BYTES_PER_ELEMENT;
  offset = offset * Float32Array.BYTES_PER_ELEMENT;

  gl.vertexAttribPointer(location, elementPerVertex, type,
    normalize, stride, offset);

  gl.enableVertexAttribArray(location);
}

function initGL() {
    const canvas = document.getElementById("glcanvas");
    const gl = canvas.getContext("webgl");

    if (!gl) {
        alert(
            "Unable to initialize WebGL. Your browser or machine may not support it."
        );
        return;
    }

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Initialize shaders and program
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(
        gl,
        gl.FRAGMENT_SHADER,
        fragmentShaderSource
    );
    const program = createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    // Create buffer
    const positionBuffer = gl.createBuffer(); // buffer on GPU
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    
    // Define vertex shader attribute
    setAttributeLoc(gl, program, "vertexPoint");
    setAttributeLoc(gl, program, "vertexColor", 3, 2);

    return gl;
}