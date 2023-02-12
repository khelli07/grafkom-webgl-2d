// Sliders
function addRangeListener(id, geo) {
    const range = document.getElementById(id);
    range.addEventListener("input", () => {
        geo.params[id] = parseFloat(range.value);
        geo.transformAndDrawObject();
    }, false);
}

// Canvas - supporting functions for listeners
function getMousePos(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
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
        
        geo.restart();
        
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

// For ripple
function applyCursorRippleEffect(e) {
    const ripple = document.createElement("div");

    ripple.className = "ripple";
    document.body.appendChild(ripple);

    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`; 

    ripple.style.animation = "ripple-effect .4s  linear";
    ripple.onanimationend = () => document.body.removeChild(ripple);

}
