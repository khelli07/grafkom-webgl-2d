
// Abstract class
class Geometry {
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
        this.addClearButtonListener();
        this.addParamsListener();
        this.addTypeListener();
        this.addColorListener();
    }

    changeColor() {
        for (let i = 0; i < this.vertices.length; i += 5) {
            this.vertices[i + 2] = this.params.color.r;
            this.vertices[i + 3] = this.params.color.g;
            this.vertices[i + 4] = this.params.color.b;
        }
        this.transformAndDrawObject();
    }
    
    transformAndDrawObject(isFinal = true) {
        let vertices = this.vertices.slice();
        vertices = this.transformObject(vertices);
        this.drawObject(vertices);
        
        if (isFinal) {
            this.addVerticesListener(vertices);
        }
    }
    
    // Supporting object functions
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

    // Supporting listener functions
    addParamsListener() {
        addRangeListener("x", this);
        addRangeListener("y", this);
        addRangeListener("angle", this);
        addRangeListener("scale", this);
        addRangeListener("shearX", this);
        addRangeListener("shearY", this);
    }

    addTypeListener() {
        addTabListener("line-tab", this);
        addTabListener("square-tab", this);
        addTabListener("rectangle-tab", this);
        addTabListener("polygon-tab", this);
    }

    addColorListener() { 
        const colorPicker = document.getElementById("color-picker");
        colorPicker.addEventListener("input", (event) => {
            this.params.color = hexToNormalizedRGB(event.target.value);
            this.changeColor();
        }, false);
    }

    addClearButtonListener() {
        const clearButton = document.getElementById("clear-btn");
        clearButton.addEventListener("click", () => {
            this.removeVerticesListener();
            this.restart();
        }, false);
    }

    resetCanvasListener() {
        this.removeVerticesListener();

        const canvas = document.getElementById("glcanvas");   
        canvas.removeEventListener("mousedown", this.mouseDownListener);
        canvas.removeEventListener("mouseup", this.mouseUpListener);
        canvas.removeEventListener("mousemove", this.mouseMoveListener);
        canvas.removeEventListener("click", this.clickListener);

        canvas.addEventListener("click", (event) => applyCursorRippleEffect(event));
    }

    addVerticesListener(vertices) {
        this.removeVerticesListener();

        vertices = clipToPixel(vertices);
        const container = document.querySelector(".canvas-container");
        for (let i = 0; i < vertices.length; i += 5) {
            let element = document.createElement("div");
            element.classList.add("point");
            element.setAttribute("id", `point-${i / 5}`);

            element.style.cssText = `
                position: absolute;
                left: ${vertices[i]}px;
                top: ${vertices[i + 1]}px;
            `

            element.addEventListener("click", (event) => {
                console.log("clicked", event.target.id);
            });

            container.appendChild(element);
        }
    }

    removeVerticesListener() {
       for (let i = 0; i < this.vertices.length; i += 5) {
           const element = document.getElementById(`point-${i / 5}`);
           if (element) {
               element.remove();
           }
       }
    }
}