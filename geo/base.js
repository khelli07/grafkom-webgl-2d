
// Abstract class
class Base {
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
        
        addClearButtonListener(this);
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