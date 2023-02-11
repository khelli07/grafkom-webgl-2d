// Sliders
function addRangeListener(id, geo) {
    const range = document.getElementById(id);
    range.addEventListener("input", () => {
        geo.params[id] = parseFloat(range.value);
        geo.transformAndDrawObject();
    }, false);
}

const addParamsListener = (geo) => {
    addRangeListener("x", geo);
    addRangeListener("y", geo);
    addRangeListener("angle", geo);
    addRangeListener("scale", geo);
    addRangeListener("shearX", geo);
    addRangeListener("shearY", geo);
}

// Canvas - supporting functions for listeners
function getMousePos(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
}

function addClearButtonListener(geo) {
    const clearButton = document.getElementById("clear-btn");
    clearButton.addEventListener("click", () => {
        geo.restart();
    }, false);
}

// Tabs
function hexToNormalizedRGB(color) {
    const r = parseInt(color.substr(1,2), 16);
    const g = parseInt(color.substr(3,2), 16);
    const b = parseInt(color.substr(5,2), 16);
    
    return {r: r/255, g: g/255, b: b/255};
}

function removeActiveTabs() {
    document.getElementById("line-tab").classList.remove("active");
    document.getElementById("square-tab").classList.remove("active");
    document.getElementById("rectangle-tab").classList.remove("active");
    document.getElementById("polygon-tab").classList.remove("active");
}

function addTabListener(id, geo) {
    const tab = document.getElementById(id);
    tab.addEventListener("click", () => {      
        removeActiveTabs();
        tab.classList.add("active");
        
        switch (id) {
            case "line-tab":
                geo = new Line(geo.gl);
                break;
            case "square-tab":
                geo = new Square(geo.gl);
                break;
            case "rectangle-tab":
                geo = new Rectangle(geo.gl);
                break;
            case "polygon-tab":
                geo = new Polygon(geo.gl);
                break;
        }

        geo.prepare();

    }, false);
}

const addTypeListener = (geo) => {
    addTabListener("line-tab", geo);
    addTabListener("square-tab", geo);
    addTabListener("rectangle-tab", geo);
    addTabListener("polygon-tab", geo);
}

const addColorListener = (geo) => { 
    const colorPicker = document.getElementById("color-picker");
    colorPicker.addEventListener("input", (event) => {
        geo.params.color = hexToNormalizedRGB(event.target.value);
        geo.changeColor();
    }, false);
}

// For fun
function applyCursorRippleEffect(e) {
    const ripple = document.createElement("div");

    ripple.className = "ripple";
    document.body.appendChild(ripple);

    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`; 

    ripple.style.animation = "ripple-effect .4s  linear";
    ripple.onanimationend = () => document.body.removeChild(ripple);

}
