const canvas = document.getElementById("glcanvas");
const CANVAS_WIDTH = canvas.getAttribute("width");
const CANVAS_HEIGHT = canvas.getAttribute("height");

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

function getClipCoordinate(x, length) {
    let half = length / 2;
    return (x - half) / half;
}

function pixelToPoint(vertices) {
    const length = vertices.length / 5;
    for (let i = 0; i < length; i++) {
        vertices[5 * i] = getClipCoordinate(vertices[5 * i], CANVAS_WIDTH);
        vertices[5 * i + 1] = -getClipCoordinate(vertices[5 * i + 1], CANVAS_HEIGHT);
    }
    return vertices;
}

function translate (vertices, x, y) {
    const length = vertices.length / 5;
    for (let i = 0; i < length; i++) {

        vertices[5 * i] += getClipCoordinate(x, CANVAS_WIDTH);
        vertices[5 * i + 1] += getClipCoordinate(y, CANVAS_HEIGHT);
    }
    return vertices
}

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