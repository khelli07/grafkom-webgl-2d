// Sliders
function addRangeListener (id, geo) {
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
function hexToNormalizedRGB(event) {
    const color = event.target.value
    const r = parseInt(color.substr(1,2), 16)
    const g = parseInt(color.substr(3,2), 16)
    const b = parseInt(color.substr(5,2), 16)
    console.log(`red: ${r}, green: ${g}, blue: ${b}`)
    
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