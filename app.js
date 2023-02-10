class Geometry {
    constructor(gl, type) {
        resetParams();
        
        this.gl = gl;
        this.vertices = [];
        this.params = {
            x: document.getElementById("x").value,
            y: document.getElementById("y").value,
            scale: document.getElementById("scale").value,
            angle: document.getElementById("angle").value,
            shearX: document.getElementById("shearX").value,
            shearY: document.getElementById("shearY").value,
            type: type
        }    
    }

    prepare() {
        addCanvasListener(this.gl, this, this.params);
        addParamsListener(this.gl, this, this.params);
    }
}

const main = () => {
    const gl = initGL();    
    const geo = new Geometry(gl, gl.LINES);
    geo.prepare();
};
