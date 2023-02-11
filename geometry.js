class Geometry {
    constructor(gl, type) {        
        this.gl = gl;
        this.type = type;
        this.restart();
    }
    
    restart() {
        resetParams();
        this.isDrawn = false;
        this.vertices = [];
        this.params = {
            x: parseInt(document.getElementById("x").value),
            y: parseInt(document.getElementById("y").value),
            scale: parseInt(document.getElementById("scale").value),
            angle: parseInt(document.getElementById("angle").value),
            shearX: parseInt(document.getElementById("shearX").value),
            shearY: parseInt(document.getElementById("shearY").value),
            type: this.type
        }

        this.transformAndDrawObject();
    }
    
    prepare() {
        this.addCanvasListener();
        addParamsListener(this);
        addTypeListener(this);
    }
    
    // Supporting methods
    addCanvasListener() {
        throw new Error("Geometry is an abstract class");
    }

    transformAndDrawObject() {
        let vertices = this.vertices.slice();
        vertices = this.transformObject(vertices);
        this.drawObject(vertices);
    }

    transformObject(vertices) {
        vertices = rescale(vertices, this.params?.scale);    
        vertices = rotate(vertices, this.params?.angle);
        vertices = translate(vertices, this.params?.x, this.params?.y);
    
        return vertices;
    }
    
    drawObject(vertices) {
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
        this.gl.drawArrays(this.type, 0, vertices.length / 5);
    }
}


class Line extends Geometry {
    constructor(gl) {
        super(gl, gl.LINES);
    }
    
    createObject (initPoint, pos, color = {r: 0.0, g: 0.0, b: 0.0}) {
        if (this.params?.type == this.gl.LINES) {
            this.vertices = [
                initPoint.x, initPoint.y, color.r, color.g, color.b,
                pos.x, pos.y, color.r, color.g, color.b,
            ]
        }
            
        this.vertices = pixelToPoint(this.vertices);
        this.transformAndDrawObject();
    }
    
    addCanvasListener() {
        // Canvas state
        let isDown = false;
        let initPoint = (0.0, 0.0);
        
        // Canvas drag and drop listener
        const canvas = document.getElementById("glcanvas");
        canvas.addEventListener("mousedown", (event) => {
            isDown = true;
    
            if (!this.isDrawn) {
                initPoint = getMousePos(canvas, event);
            }
        }, false);
        
        canvas.addEventListener("mousemove", (event) => {
            if (!this.isDrawn && isDown) {   
                const pos = getMousePos(canvas, event);
                this.createObject(initPoint, pos);
            }
        }, false);
        
        canvas.addEventListener("mouseup", (event) => {
            isDown = false;
            this.isDrawn = true;
    
            if (!this.isDrawn) {
                const pos = getMousePos(canvas, event);
                this.createObject(initPoint, pos);
            }
        }, false);
    }
}