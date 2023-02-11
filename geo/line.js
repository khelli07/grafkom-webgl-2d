
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
}