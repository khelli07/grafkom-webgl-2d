const main = () => {
    const gl = initGL();    
    let geo = new Line(gl);
    geo.prepare();

    const loadModel = document.getElementById('load-model');
        
    loadModel.addEventListener('change', (event) => {
        parseJsonFile(event.target.files[0]).then((data) => {
            const id = data["type"] + "-tab";
            removeActiveTabs();
            document.getElementById(id).classList.add("active");
            
            geo = changeGeoById(id, geo);
            geo.vertices = data["vertices"];
            geo.transformAndDrawObject();
        })
    });
};
