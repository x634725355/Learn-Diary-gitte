const THREE = require('./three');

// 场景
const scene = new THREE.Scene();
// 相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerHeight, window.innerHeight);
document.body.appendChild(renderer.domElement);
