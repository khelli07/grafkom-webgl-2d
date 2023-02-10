const canvas = document.getElementById("glcanvas");
const CANVAS_WIDTH = canvas.getAttribute("width");
const CANVAS_HEIGHT = canvas.getAttribute("height");

const xRange = document.getElementById("x");
xRange.setAttribute("max", CANVAS_WIDTH / 2);
xRange.setAttribute("min", -CANVAS_WIDTH / 2);

const yRange = document.getElementById("y");
yRange.setAttribute("max", CANVAS_HEIGHT / 2);
yRange.setAttribute("min", -CANVAS_HEIGHT / 2);

function translate (vertices, x, y) {
    const length = vertices.length / 5;
    for (let i = 0; i < length; i++) {

        vertices[5 * i] += x / (CANVAS_WIDTH / 2);
        vertices[5 * i + 1] += y / (CANVAS_HEIGHT / 2);
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