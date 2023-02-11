const canvas = document.getElementById("glcanvas");
const CANVAS_WIDTH = canvas.getAttribute("width");
const CANVAS_HEIGHT = canvas.getAttribute("height");

/**
 * @description Reset Base parameters
 */
function resetParams() {
    const xRange = document.getElementById("x");
    xRange.setAttribute("min", 0);
    xRange.setAttribute("max", CANVAS_WIDTH);
    xRange.value = CANVAS_WIDTH / 2;
    
    const yRange = document.getElementById("y");
    yRange.setAttribute("min", 0);
    yRange.setAttribute("max", CANVAS_HEIGHT);
    yRange.value = CANVAS_HEIGHT / 2;

    document.getElementById("angle").value = 0;
    document.getElementById("scale").value = 1;
    document.getElementById("shearX").value = 0;
    document.getElementById("shearY").value = 0;
}

/**
 * @description Convert pixel to clip value [-1..1]
 * @param {integer} x - pixel value x
 */
function getXClipValue(x) {
    let half = CANVAS_WIDTH / 2;
    return (x - half) / half;
}

/**
 * @description Convert pixel to clip value [-1..1]
 * @param {integer} y - pixel value y
 */
function getYClipValue(y) {
    let half = CANVAS_HEIGHT / 2;
    return -(y - half) / half;
}

/**
 * @description Convert pixel to clip coordinate [-1..1]
 * @param {vertices} Array<Integer>[]
 */
function pixelsToPoints(vertices) {
    for (let i = 0; i < vertices.length; i += 5) {
        vertices[i] = getXClipValue(vertices[i]);
        vertices[i + 1] = getYClipValue(vertices[i + 1]);
    }
    return vertices;
}

/**
 * @description Translate the object by x and y
 * @param {vertices} Array<Float>[]
 * @param {float} x
 * @param {float} y
 */
function translate(vertices, x, y) {
    for (let i = 0; i < vertices.length; i += 5) {
        vertices[i] += getXClipValue(x);
        vertices[i + 1] += getYClipValue(y);
    }
    return vertices
}

/**
 * @description Rotate the object by angle
 * @param {vertices} Array<Float>[]
 * @param {integer} angle [0..360]
 */
function rotate(vertices, angle) {
    angle = angle * Math.PI / 180;
    
    for (let i = 0; i < vertices.length; i += 5) {
        x = vertices[i];
        y = vertices[i + 1];

        vertices[i] = x * Math.cos(angle) - y * Math.sin(angle);
        vertices[i + 1] = x * Math.sin(angle) + y * Math.cos(angle);
    }
    return vertices;
}

/**
 * @description Rescale the object by scale
 * @param {vertices} Array<Float>[]
 * @param {float} scale
 */
function rescale(vertices, scale) {
    for (let i = 0; i < vertices.length; i += 5) {
        x = vertices[i];
        y = vertices[i + 1];

        vertices[i] *= scale;
        vertices[i + 1] *= scale;
    }
    return vertices;
}

function shear(vertices, shearX, shearY) {
    throw new Error("Not implemented");
}