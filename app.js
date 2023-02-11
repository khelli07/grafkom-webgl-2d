class Geometry {
    constructor(gl, type) {        
        this.gl = gl;
        this.type = type;

        this.restart();
    }

    restart() {
        resetParams();
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

        console.log(this.params);

        transformAndDrawObject(this);
    }

    prepare() {
        addCanvasListener(this);
        addParamsListener(this);
    }
}

const main = () => {
    const gl = initGL();    
    const geo = new Geometry(gl, gl.LINES);
    geo.prepare();
};
