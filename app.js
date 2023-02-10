
const main = () => {
    // Initialization
    const gl = initGL();

    // Variables
    let params = {
        x: document.getElementById('x').value,
        y: document.getElementById('y').value,
        scale: document.getElementById('scale').value,
        angle: document.getElementById('angle').value,
        shearX: document.getElementById('shearX').value,
        shearY: document.getElementById('shearY').value,
        type: gl.LINES
    }
    
    const initialVertices = [
        // X, Y         // R, G, B
        0, -0.5,           1.0, 0.0, 0.5,
        0, 0.5,         1.0, 0.0, 0.5
    ];

    console.log(initialVertices);
    // Draw object
    transformAndDrawObject(gl, initialVertices, params);
    addParamsListener(gl, initialVertices, params);

};
