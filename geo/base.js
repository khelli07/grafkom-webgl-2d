
// Abstract class
class Base {
    constructor(gl, type) {        
        this.gl = gl;
        this.type = type;
        this.restart();
    }
    
    // Must implement
    addCanvasListener() {
        throw new Error("Geometry is an abstract class");
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
            color: hexToNormalizedRGB(document.getElementById("color-picker").value),
            type: this.type
        }

        this.transformAndDrawObject();
    }
    
    prepare() {
        this.resetCanvasListener();
        this.addCanvasListener();
        
        addClearButtonListener(this);
        addParamsListener(this);
        addTypeListener(this);
        addColorListener(this);
    }

    changeColor() {
        for (let i = 0; i < this.vertices.length; i += 5) {
            this.vertices[i + 2] = this.params.color.r;
            this.vertices[i + 3] = this.params.color.g;
            this.vertices[i + 4] = this.params.color.b;
        }
        this.transformAndDrawObject();
    }
    
    transformAndDrawObject() {
        let vertices = this.vertices.slice();
        vertices = this.transformObject(vertices);
        this.drawObject(vertices);
    }
    
    // Supporting functions
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

    resetCanvasListener() {
        const canvas = document.getElementById("glcanvas");   
        canvas.removeEventListener("mousedown", this.mouseDownListener);
        canvas.removeEventListener("mouseup", this.mouseUpListener);
        canvas.removeEventListener("mousemove", this.mouseMoveListener);
        canvas.removeEventListener("click", this.clickListener);

        canvas.addEventListener("click", (event) => applyCursorRippleEffect(event)); 
    }
}