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
 * @param {integer} value - pixel value (x or y)
 * @param {integer} length - max canvas width or height
 */
function getClipValue(value, length) {
    let half = length / 2;
    return (value - half) / half;
}

/**
 * @description Convert pixel to clip coordinate [-1..1]
 * @param {vertices} Array<Integer>[]
 */
function pixelToPoint(vertices) {
    const length = vertices.length / 5;
    for (let i = 0; i < length; i++) {
        vertices[5 * i] = getClipValue(vertices[5 * i], CANVAS_WIDTH);
        vertices[5 * i + 1] = -getClipValue(vertices[5 * i + 1], CANVAS_HEIGHT);
    }
    return vertices;
}

/**
 * @description Translate the object by x and y
 * @param {vertices} Array<Float>[]
 * @param {float} x
 * @param {float} y
 */
function translate (vertices, x, y) {
    const length = vertices.length / 5;
    for (let i = 0; i < length; i++) {

        vertices[5 * i] += getClipValue(x, CANVAS_WIDTH);
        vertices[5 * i + 1] += getClipValue(y, CANVAS_HEIGHT);
    }
    return vertices
}

/**
 * @description Rotate the object by angle
 * @param {vertices} Array<Float>[]
 * @param {integer} angle [0..360]
 */
function rotate (vertices, angle) {
    angle = angle * Math.PI / 180;
    
    const length = vertices.length / 5;
    for (let i = 0; i < length; i++) {
        x = vertices[5 * i];
        y = vertices[5 * i + 1];

        vertices[5 * i] = x * Math.cos(angle) - y * Math.sin(angle);
        vertices[5 * i + 1] = x * Math.sin(angle) + y * Math.cos(angle);
    }
    return vertices;
}

/**
 * @description Rescale the object by scale
 * @param {vertices} Array<Float>[]
 * @param {float} scale
 */
function rescale (vertices, scale) {
    const length = vertices.length / 5;
    for (let i = 0; i < length; i++) {
        x = vertices[5 * i];
        y = vertices[5 * i + 1];

        vertices[5 * i] *= scale;
        vertices[5 * i + 1] *= scale;
    }
    return vertices;
}

function shear (vertices, shearX, shearY) {
    throw new Error("Not implemented");
}