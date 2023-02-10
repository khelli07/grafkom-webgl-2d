function transformObject (vertices, params) {
    vertices = rescale(vertices, params?.scale);    
    vertices = rotate(vertices, params?.angle);
    vertices = translate(vertices, params?.x, params?.y);

    return vertices;
}

function drawObject (gl, type, vertices) {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.drawArrays(type, 0, vertices.length / 5);
}

function transformAndDrawObject (gl, geometry, params) {
    let vertices = geometry.vertices.slice();
    vertices = transformObject(vertices, params);
    drawObject(gl, params?.type, vertices);
    console.log("sliced", vertices);
}

// Sliders
function addRangeListener (id, gl, vertices, params) {
    const range = document.getElementById(id);
    range.addEventListener("input", () => {
        params[id] = parseFloat(range.value);
        transformAndDrawObject(gl, vertices, params);
    }, false);
}

const addParamsListener = (gl, vertices, params) => {
    addRangeListener("x", gl, vertices, params);
    addRangeListener("y", gl, vertices, params);
    addRangeListener("angle", gl, vertices, params);
    addRangeListener("scale", gl, vertices, params);
    addRangeListener("shearX", gl, vertices, params);
    addRangeListener("shearY", gl, vertices, params);
}

// Canvas
function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
}

function createObject (gl, geometry, params, initPoint, pos, color = {r: 0.0, g: 0.0, b: 0.0}) {
    geometry.vertices = [
        initPoint.x, initPoint.y, color.r, color.g, color.b,
        pos.x, pos.y, color.r, color.g, color.b,
    ]

    geometry.vertices = pixelToPoint(geometry.vertices);
    transformAndDrawObject(gl, geometry, params);
}

const addCanvasListener = (gl, geometry, params) => {
    let isDrawn = false;
    let isDown = false;
    let initPoint = (0.0, 0.0);
    
    const canvas = document.getElementById("glcanvas");
    canvas.addEventListener("mousedown", (event) => {
        isDown = true;

        if (!isDrawn) {
            initPoint = getMousePos(canvas, event);
        }
    }, false);
    
    canvas.addEventListener("mousemove", (event) => {
        if (!isDrawn && isDown) {   
            const pos = getMousePos(canvas, event);
            createObject(gl, geometry, params, initPoint, pos);
        }
    }, false);
    
    canvas.addEventListener("mouseup", (event) => {
        isDown = false;
        isDrawn = true;

        if (!isDrawn) {
            const pos = getMousePos(canvas, event);
            createObject(gl, geometry, params, initPoint, pos);
        }
    }, false);

    const clearButton = document.getElementById("clear-btn");
    clearButton.addEventListener("click", () => {
        isDrawn = false;
        geometry.vertices = [];
        transformAndDrawObject(gl, geometry, params);
        resetParams();
    }, false);
}
