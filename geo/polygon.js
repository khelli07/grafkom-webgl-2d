
class Polygon extends Geometry {
    constructor(gl) {
        super(gl, gl.TRIANGLE_FAN);
    }
    
    addCanvasListener() {   
        // Canvas drag and drop listener
        const canvas = document.getElementById("glcanvas");
        canvas.addEventListener("click", (event) => {
            let pos = getMousePos(canvas, event);

            let x = getXClipValue(pos.x);
            let y = getYClipValue(pos.y);

            this.addVertex(x, y);
            this.createPolygonObject();
        }, false);
    }

    addVertex(x, y) {
        const { r, g, b } = this.params.color;
        this.vertices.push(x, y, r, g, b);
    }

    createPolygonObject() {
        this.vertices = convexHull(this.vertices);
        this.sortVertices();
        this.transformAndDrawObject();
    }

    // Supporting Functions
    sortVertices() {
        let tuples = this.verticesToTuples(this.vertices);
        tuples = tuples.sort((a, b) => this.angleComparator(a, b));
        this.vertices = this.tuplesToVertices(tuples);
    }

    verticesToTuples(vertices) {
        let tuples = [];
        for (let i = 0; i < vertices.length; i += 5) {
            tuples.push([vertices[i], vertices[i + 1], 
                vertices[i + 2], vertices[i + 3], vertices[i + 4]]);
        }
        return tuples;
    }

    tuplesToVertices(tuples) {
        let vertices = [];
        for (let i = 0; i < tuples.length; i++) {
            vertices.push(...tuples[i]);
        }
        return vertices;
    }

    getQuadrant(x, y) {
        if (x >= 0 && y >= 0) return 1;
        if (x <= 0 && y > 0) return 2;
        if (x < 0 && y <= 0) return 3;
        if (x > 0 && y < 0) return 4;
    }
    
    angleComparator(a, b) {
        const aQuadrant = this.getQuadrant(a[0], a[1]);
        const bQuadrant = this.getQuadrant(b[0], b[1]);
        if (aQuadrant === bQuadrant) {
            return Math.atan(a[1] / a[0]) - Math.atan(b[1] / b[0]);
        } else {
            return aQuadrant - bQuadrant;
        }
    }
}