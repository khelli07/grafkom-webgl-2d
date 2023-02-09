/* 
Notes:

* gl_Position (vertex shader) and gl_FragColor (fragment shader) are special variables. They must be specified.

* Process: 
Raw vertex data (CPU) -> Buffer (GPU) -> Shader Program (GPU) [Vertex Shader -> Fragment Shader] -> Display

* For each shader: 
    1. Create shader
    2. Put source (text) to the shader
    3. Compile shader
    4. Attach shader to program (after created)

* Program:
    1. Create program
    2. Attach shaders
    3. Link program

* MUST DO:
    1. Create buffer
    2. Define attribute (input) for vertex shader
    3. Use program


*/

const main = function () {
    // Initialize GL
    const canvas = document.querySelector("#glcanvas");
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


    // Define vertex shader attribute "a_position"
    setAttributeLoc(gl, program, "a_position");

    let matrix = [
        0.5, 0, 0, 0, 
        0, 0.5, 0, 0, 
        0, 0, 0.5, 0, 
        0, 0, 0, 1
    ];

    setMat4UniformLoc(gl, program, "translationMatrix", matrix);

    // Vertices
    let vertices = [
        // X, Y
        0.0, 0.5, 
        -0.5, -0.5, 
        0.5, -0.5,
    ];

    // Supply data to buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
};
