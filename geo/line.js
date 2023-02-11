
class Line extends Base {
    constructor(gl) {
        super(gl, gl.LINES);
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
                this.createLineObject(initPoint, pos);
            }
        }, false);
        
        canvas.addEventListener("mouseup", (event) => {
            isDown = false;
            this.isDrawn = true;
    
            if (!this.isDrawn) {
                const pos = getMousePos(canvas, event);
                this.createLineObject(initPoint, pos);
            }
        }, false);
    }

    createLineObject (initPoint, pos) {
        const { r, g, b } = this.params?.color;
        this.vertices = [
            initPoint.x, initPoint.y, r, g, b,
            pos.x, pos.y, r, g, b
        ];
        
        this.vertices = pixelsToPoints(this.vertices);
        this.transformAndDrawObject();
    }
}