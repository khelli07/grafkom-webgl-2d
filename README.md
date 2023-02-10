## How WebGL Works

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
