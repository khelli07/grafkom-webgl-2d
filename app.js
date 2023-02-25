
const loadBtn = document.getElementById('load-model');

loadBtn.addEventListener('click', () => {});


const main = () => {
    const gl = initGL();    
    const geo = new Line(gl);
    geo.prepare();
};
