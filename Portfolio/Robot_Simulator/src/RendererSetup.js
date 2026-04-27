import * as THREE from "three";


// Parameters
const fov = 40;
const near = 2;
const far = 2000;

// Camera
const camera = new THREE.PerspectiveCamera(fov, 1, near, far)
camera.position.set(-10, 10, 10);
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

function Resize() 
{
  const w = window.innerWidth;
  const h = window.innerHeight;

  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener("resize", Resize);
Resize();

export const Renderer = renderer;
export const Camera = camera;