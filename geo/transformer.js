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

function convexHull(vertices){
    // Get the divider (line by leftmost & rightmost)
    let divider = getDivider(vertices)

    // Divide the vertices into 2 pool
    let divideresult = divide(vertices, divider)
    let S1 = divideresult[0]
    let S2 = divideresult[1]

    // Create convexhull variable and push divider points into it
    let convexhull = []
    for (let j = 0; j < divider.length; j += 1){
        convexhull.push(divider[j])
    }

    // Start recursion by divide & conquer
    if (S1.length > 0){
        convexhull = recursion(S1, divider, convexhull)
    }
    if (S2.length > 0){
        convexhull = recursion(S2, divider, convexhull)
    }

    return convexhull

    // Get divider points, leftmost and rightmost
    function getDivider(vertices){
        let vlen = vertices.length
        let rightmost = [
            vertices[0], 
            vertices[1], 
            vertices[2],
            vertices[3],
            vertices[4]
        ]
        let leftmost = [
            vertices[vlen - 5], 
            vertices[vlen - 4], 
            vertices[vlen - 3],
            vertices[vlen - 2],
            vertices[vlen - 1]
        ]
        for (let i = 0; i < vertices.length; i += 5){
            if (leftmost[0] > vertices[i]){
                leftmost[0] = vertices[i]
                leftmost[1] = vertices[i + 1]
                leftmost[2] = vertices[i + 2]
                leftmost[3] = vertices[i + 3]
                leftmost[4] = vertices[i + 4]
            }
            if (rightmost[0] < vertices[i]){
                rightmost[0] = vertices[i]
                rightmost[1] = vertices[i + 1]
                rightmost[2] = vertices[i + 2]
                rightmost[3] = vertices[i + 3]
                rightmost[4] = vertices[i + 4]
            }
        }

        return [leftmost[0],leftmost[1],leftmost[2],leftmost[3],leftmost[4],
                rightmost[0],rightmost[1],rightmost[2],rightmost[3],rightmost[4]]
    }

    // Determinant function
    // To determine a points pool
    // + means S1, - means S2
    function determinant(divider, point){
        let sum1 = divider[0]*divider[6] + point[0]*divider[1] + divider[5]*point[1]
        let sum2 = point[0]*divider[6] + divider[5]*divider[1] + divider[0]*point[1]
        return sum1 - sum2
    }

    // Divide function
    // Fill S1 and S2 based on divider splitting
    function divide(v, divider){
        let s1 = []
        let s2 = []
        for (let i = 0; i < v.length; i += 5){
            let point = [v[i], v[i + 1], v[i + 2], v[i + 3], v[i + 4]]
            if (determinant(divider, point) > 0){
                for (let j = 0; j < point.length; j += 1){
                    s1.push(point[j])
                }
            } else if (determinant(divider, point) < 0){
                for (let j = 0; j < point.length; j += 1){
                    s2.push(point[j])
                }
            }
        }
        return [s1, s2]
    }

    // Recursion Function
    // Base : Only 1 points in St
    function recursion(St, div, ch){
        if (St.length == 5){ // Base
            for (let i = 0; i < St.length; i += 1){
                ch.push(St[i])
            }
            return ch
        }

        let s1, s2

        // Take the farthest point perpendicular from the divider line
        let farthest = [St[0], St[1], St[2], St[3], St[4]]
        let farthestlen = pointToLine(div, [St[0], St[1]])

        for (let i = 5; i < St.length; i += 5){
            let currentfarthest = pointToLine(div, [St[i], St[i+1]])
            if (currentfarthest > farthestlen){
                farthest = [St[i], St[i+1], St[i+2], St[i+3], St[i+4]]
                farthestlen = currentfarthest
            }
        }
        for (let j = 0; j < farthest.length; j += 1){ // pun the farthest points to 
            ch.push(farthest[j])
        }


        // Select points only outside the triangle made by divider and farthest point
        let eligiblepoints = []
        for (let i = 0; i < St.length; i += 5){
            let isInTriangle = isPointInTriangle([St[i],St[i+1]], div, farthest)
            if (!isInTriangle) {
                for (let j = 0; j < 5; j += 1){
                    eligiblepoints.push(St[i + j])
                }
            }
        }
        let divider1 = [
            div[0],div[1],div[2],div[3],div[4],
            farthest[0],farthest[1],farthest[2],farthest[3],farthest[4]
        ]
        let divider2 = [
            farthest[0],farthest[1],farthest[2],farthest[3],farthest[4],
            div[5],div[6],div[7],div[8],div[9]
        ]

        // Divide
        let divided = divide(eligiblepoints, divider1)
        s1 = divided[0]
        s2 = divided[1]
        if (s1.length > 0){
            ch = recursion(s1, divider1, ch)
        }
        if (s2.length > 0){
            ch = recursion(s2, divider2, ch)
        }
        return ch
    }

    // Point to line perpendicular length formula
    function pointToLine(div, p){
        let A = p[0] - div[0];
        let B = p[1] - div[1];
        let C = div[5] - div[0];
        let D = div[6] - div[1];

        let dot = A * C + B * D;
        let len_sq = C * C + D * D;
        let param = -1;

        if (len_sq != 0){
            param = dot / len_sq;
        }

        let xx, yy;

        if (param < 0) {
            xx = div[0];
            yy = div[1];
        } else if (param > 1) {
            xx = div[5];
            yy = div[6];
        } else {
            xx = div[0] + param * C;
            yy = div[1] + param * D;
        }

        let dx = p[0] - xx;
        let dy = p[1] - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Point inside triangle checker using barycentric coordinates
    function isPointInTriangle(p, div, f) {
        // Extract the 3 points of the triangle
        var A = [div[0], div[1]];
        var B = [div[5], div[6]];
        var C = [f[0], f[1]];
      
        // Calculate vectors
        var AB = [B[0] - A[0], B[1] - A[1]];
        var AC = [C[0] - A[0], C[1] - A[1]];
        var AP = [p[0] - A[0], p[1] - A[1]];
      
        // Calculate dot products
        var dotABAB = dotProduct(AB, AB); 
        var dotABAC = dotProduct(AB, AC);
        var dotACAC = dotProduct(AC, AC);
        var dotAPAB = dotProduct(AP, AB);
        var dotAPAC = dotProduct(AP, AC);
      
        // Calculate barycentric coordinates
        var denominator = (dotABAB * dotACAC - dotABAC * dotABAC);
        var u = (dotACAC * dotAPAB - dotABAC * dotAPAC) / denominator;
        var v = (dotABAB * dotAPAC - dotABAC * dotAPAB) / denominator;
      
        // Check if point is inside triangle
        return (u >= 0) && (v >= 0) && (u + v <= 1);
    }

    // Dot product function
    // For point inside triangle checker
    function dotProduct(v1, v2) {
        return v1[0] * v2[0] + v1[1] * v2[1];
    }


}