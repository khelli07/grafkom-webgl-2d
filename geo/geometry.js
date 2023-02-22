
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
            transformX: parseInt(document.getElementById("transformX").value),
            transformY: parseInt(document.getElementById("transformY").value),
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
        vertices = transformX(vertices, this.params?.transformX);
        vertices = transformY(vertices, this.params?.transformY); 
        // vertices = shear(vertices, this.params?.shearX, this.params?.shearY);
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
        addRangeListener("transformX", this);
        addRangeListener("transformY", this);
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

        const oldCanvas = document.getElementById("glcanvas");  
        const newCanvas = oldCanvas.cloneNode(true);
        oldCanvas.parentNode.replaceChild(newCanvas, oldCanvas);
        newCanvas.addEventListener("click", (event) => applyCursorRippleEffect(event));
    
        this.gl = initGL();
    }

    addVerticesListener(vertices) {
        this.removeVerticesListener();

        vertices = clipToPixel(vertices);
        const container = document.querySelector(".canvas-container");
        const canvas = document.getElementById("glcanvas");
        for (let i = 0; i < vertices.length; i += 5) {
            let element = document.createElement("div");
            element.classList.add("point");
            element.setAttribute("id", `point-${i / 5}`);
            element.style.cssText = `
                position: absolute;
                left: ${vertices[i] - 2}px;
                top: ${vertices[i + 1] - 2}px;
            `

            element.addEventListener("click", () => {
                let colorPicker = document.createElement("input");
                colorPicker.setAttribute("type", "color");
                colorPicker.setAttribute("id", `color-picker-${i / 5}`);

                colorPicker.classList.add("color-input");
                colorPicker.value = document.getElementById("color-picker").value;
                colorPicker.style.cssText = `
                    position: absolute;
                    left: ${vertices[i] + 20}px;
                    top: ${vertices[i + 1] - 20}px;
                `

                colorPicker.addEventListener("input", (event) => {
                    let { r, g, b } = hexToNormalizedRGB(event.target.value);
                    this.vertices[i + 2] = r;
                    this.vertices[i + 3] = g;
                    this.vertices[i + 4] = b;
                    this.transformAndDrawObject();
                }, false);
                
                colorPicker.addEventListener("blur", () => {
                    colorPicker.remove();
                }, false);
                
                container.appendChild(colorPicker);
                colorPicker.focus();
            });

            element.addEventListener("dblclick", () => {
                let colorPicker = document.querySelector(`#color-picker-${i / 5}`);
                if (colorPicker) {
                    colorPicker.blur();
                }

                this.vertices.splice(i, 5);
                this.transformAndDrawObject();

                if (this.vertices.length == 0) {
                    this.removeVerticesListener();
                    this.restart();
                }
            }, false);

            element.addEventListener("drag", (event) => { 
                const pos = getMousePos(canvas, event);
                if (pos.x > 0 && pos.y > 0) {
                    this.vertices[i] = getXClipValue(pos.x);
                    this.vertices[i + 1] = getYClipValue(pos.y);
                    this.transformAndDrawObject();
                }
            }, false);

            element.addEventListener("dragend", (event) => { 
                const pos = getMousePos(canvas, event);
                this.vertices[i] = getXClipValue(pos.x);
                this.vertices[i + 1] = getYClipValue(pos.y);
                this.transformAndDrawObject();
            }, false);
            
            container.appendChild(element);
        }
    }

    removeVerticesListener() {
        const points = document.querySelectorAll(".point");
        points.forEach((point) => {
            point.remove();
        });
    }

    addVertexColorPicker() {
    }
}