const transformObject = (vertices, params) => {
    vertices = rescale(vertices, params?.scale);    
    vertices = rotate(vertices, params?.angle);
    vertices = translate(vertices, params?.x, params?.y);

    return vertices;
}

const drawObject = (gl, type, vertices) => {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.drawArrays(type, 0, vertices.length / 5);
}

const transformAndDrawObject = (gl, initialVertices, params) => {
    let vertices = initialVertices.slice();
    vertices = transformObject(vertices, params);
    drawObject(gl, params?.type, vertices);
}

const addRangeListener = (id, gl, vertices, params) => {
    const range = document.getElementById(id);
    range.addEventListener('input', function () {
        params[id] = parseFloat(range.value);
        transformAndDrawObject(gl, vertices, params);
    });
}

const addParamsListener = (gl, vertices, params) => {
    addRangeListener('x', gl, vertices, params);
    addRangeListener('y', gl, vertices, params);
    addRangeListener('angle', gl, vertices, params);
    addRangeListener('scale', gl, vertices, params);
    addRangeListener('shearX', gl, vertices, params);
    addRangeListener('shearY', gl, vertices, params);
}