
class Square extends Geometry {
    constructor(gl) {
        super(gl, gl.TRIANGLE_FAN); // change type
    }
    
    addCanvasListener() {
        // Implement click (drag-drop) behavior
        let isDown = false;
        let initPoint = (0.0, 0.0);

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
                this.createSquareObject(initPoint, pos, false);
            }
        }, false);

        canvas.addEventListener("mouseup", (event) => {
            isDown = false;
            
            if (!this.isDrawn) {
                const pos = getMousePos(canvas, event);
                this.createSquareObject(initPoint, pos, true);
                this.isDrawn = true;
            }
        }, false);
    }

    createSquareObject (initPoint, pos, isFinal){
        const { r, g, b } = this.params?.color;
        let sqlen = Math.abs(pos.x - initPoint.x);
        let posXsmaller = pos.x < initPoint.x;
        let posYsmaller = pos.y < initPoint.y;
        let xsubs, ysubs;

        if (posXsmaller){
            if (posYsmaller) {
                xsubs = initPoint.x - sqlen;
                ysubs = initPoint.y - sqlen;
            } else {
                xsubs = initPoint.x - sqlen;
                ysubs = initPoint.y + sqlen;
            }
        }
        else {
            if (posYsmaller) {
                xsubs = initPoint.x + sqlen;
                ysubs = initPoint.y - sqlen;

            }
            else{
                xsubs = initPoint.x + sqlen;
                ysubs = initPoint.y + sqlen;
            }
        }
        this.vertices = [
            initPoint.x, initPoint.y, r, g, b,
            xsubs, initPoint.y, r, g, b,
            xsubs, ysubs, r, g, b,
            xsubs, ysubs, r, g, b,
            initPoint.x, ysubs, r, g, b,
            initPoint.x, initPoint.y, r, g, b
        ];
        
        this.vertices = pixelToClip(this.vertices);
        this.transformAndDrawObject(isFinal);
    }
}