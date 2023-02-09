const vertexShaderSource = `
attribute vec4 a_position;
uniform mat4 translationMatrix;

void main() {
    gl_Position = translationMatrix * a_position;
}
`;

const fragmentShaderSource = `
precision mediump float; // best practice to specify this

void main() {
    gl_FragColor = vec4(1, 0, 0.5, 1);
}
`;
