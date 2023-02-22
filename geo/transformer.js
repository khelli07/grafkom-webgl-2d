const canvas = document.getElementById("glcanvas");
const CANVAS_WIDTH = canvas.getAttribute("width");
const CANVAS_HEIGHT = canvas.getAttribute("height");

/**
 * @description Reset Geometry parameters
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
    document.getElementById("transformX").value = 1;
    document.getElementById("transformY").value = 1;
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
 * @description Convert pixel to clip coordinates [-1..1]
 * @param {vertices} Array<Integer>[]
 */
function pixelToClip(vertices) {
    for (let i = 0; i < vertices.length; i += 5) {
        vertices[i] = getXClipValue(vertices[i]);
        vertices[i + 1] = getYClipValue(vertices[i + 1]);
    }
    return vertices;
}

/**
 * @description Convert clip to pixel value
 * @param {float} x - clip value x [-1..1]
 */
function getXPixelValue(x) {
    let half = CANVAS_WIDTH / 2;
    return x * half + half;
}

/**
 * @description Convert clip to pixel value
 * @param {float} y - clip value y [-1..1]
 */
function getYPixelValue(y) {
    let half = CANVAS_HEIGHT / 2;
    return -y * half + half;
}

/**
 * @description Convert clip to pixel coordinates
 * @param {vertices} Array<Integer>[]
 */
function clipToPixel(vertices) {
    for (let i = 0; i < vertices.length; i += 5) {
        vertices[i] = getXPixelValue(vertices[i]);
        vertices[i + 1] = getYPixelValue(vertices[i + 1]);
    }
    return vertices;
}

/**
 * @description Find the center of a certaion amount of ve
 * @param {vertices} Array<Integer>[]
 */
function findCenter(vertices) {
    sumX = 0;
    sumY = 0;
    n = 0;
    for(let i = 0; i < vertices.length; i += 5) {
        sumX += vertices[i];
        sumY += vertices[i+1];
        n += 1;
    }
    return[sumX/n,sumY/n];
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
    avg = findCenter(vertices);
    for (let i = 0; i < vertices.length; i += 5) {
        x = vertices[i] - avg[0];
        y = vertices[i + 1] - avg[1];

        vertices[i] = x*Math.cos(angle) - y*Math.sin(angle) + avg[0];
        vertices[i + 1] = x*Math.sin(angle) + y*Math.cos(angle) + avg[1];
    }
    return vertices;
}

/**
 * @description Rescale the object by scale
 * @param {vertices} Array<Float>[]
 * @param {float} scale
 */
function rescale(vertices, scale) {
    avg = findCenter(vertices);
    for (let i = 0; i < vertices.length; i += 5) {
        vertices[i] = ((vertices[i] - avg[0])*scale)+avg[0];
        vertices[i + 1] = ((vertices[i + 1] - avg[1])*scale)+avg[1];
    }
    return vertices;
}

/**
 * @description Chnage the width of a rectangle by transformX
 * @param {vertices} Array<Float>[]
 * @param {float} transformX
 */
function transformX(vertices, transformX) {
    avg = findCenter(vertices);
    for (let i = 0; i < vertices.length; i += 5) {
        vertices[i] = ((vertices[i] - avg[0])*transformX)+avg[0];
    }
    return vertices;
}

/**
 * @description Chnage the height of a rectangle by transformX
 * @param {vertices} Array<Float>[]
 * @param {float} transformY
 */
function transformY(vertices, transformY) {
    avg = findCenter(vertices);
    for (let i = 0; i < vertices.length; i += 5) {
        vertices[i + 1] = ((vertices[i + 1] - avg[1])*transformY)+avg[1];
    }
    return vertices;
}

function shear(vertices, shearX, shearY) {
    for (let i = 0; i < vertices.length; i += 5) {
        // x = vertices[i] - avg[0];
        // y = vertices[i + 1] - avg[1];

        // vertices[i] = (x + y * shearX) + avg[0];
        // vertices[i + 1] = (y + x * shearY) + avg[1];

        vertices[i] = ((vertices[i])*shearX)+avg[0];
        vertices[i + 1] = ((vertices[i + 1] - avg[1])*shearY)+avg[1];
      }
}