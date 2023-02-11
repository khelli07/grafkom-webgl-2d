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

function transformAndDrawObject (geo) {
    let vertices = geo.vertices.slice();
    vertices = transformObject(vertices, geo.params);
    drawObject(geo.gl, geo.params?.type, vertices);
}

// Sliders
function addRangeListener (id, geo) {
    const range = document.getElementById(id);
    range.addEventListener("input", () => {
        geo.params[id] = parseFloat(range.value);
        transformAndDrawObject(geo);
    }, false);
}

const addParamsListener = (geo) => {
    addRangeListener("x", geo);
    addRangeListener("y", geo);
    addRangeListener("angle", geo);
    addRangeListener("scale", geo);
    addRangeListener("shearX", geo);
    addRangeListener("shearY", geo);
}

// Canvas
function getMousePos(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
}

function createObject (geo, initPoint, pos, color = {r: 0.0, g: 0.0, b: 0.0}) {
    geo.vertices = [
        initPoint.x, initPoint.y, color.r, color.g, color.b,
        pos.x, pos.y, color.r, color.g, color.b,
    ]

    geo.vertices = pixelToPoint(geo.vertices);
    transformAndDrawObject(geo);
}

const addCanvasListener = (geo) => {
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
            createObject(geo, initPoint, pos);
        }
    }, false);
    
    canvas.addEventListener("mouseup", (event) => {
        isDown = false;
        isDrawn = true;

        if (!isDrawn) {
            const pos = getMousePos(canvas, event);
            createObject(geo, initPoint, pos);
        }
    }, false);

    const clearButton = document.getElementById("clear-btn");
    clearButton.addEventListener("click", () => {
        isDrawn = false;
        geo.restart();
    }, false);
}
