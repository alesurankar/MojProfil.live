import * as THREE from "three";

// Parameters
const w = window.innerWidth;
const h = window.innerHeight;
const fov = 40;
const aspect = w / h;
const near = 20;
const far = 2000000;

// Camera
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(-1000, 1000, 1000);
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    //antialias: true,
    //logarithmicDepthBuffer: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(w, h);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.physicallyCorrectLights = true;

export const Renderer = renderer;
export const Camera = camera;