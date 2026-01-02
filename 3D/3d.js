import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";


///////////////////////////////////////////////
const scene = new THREE.Scene();
const w = window.innerWidth;
const h = window.innerHeight;
const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);


/////////////////////////////////////////////
const canvas = document.createElement('canvas');
canvas.width = 1;
canvas.height = 256;
const ctx = canvas.getContext('2d');

const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
gradient.addColorStop(0, '#101726'); // top
gradient.addColorStop(1, '#202228'); // bottom
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, canvas.width, canvas.height);

const texture = new THREE.CanvasTexture(canvas);
texture.magFilter = THREE.LinearFilter;
texture.minFilter = THREE.LinearFilter;
texture.encoding = THREE.sRGBEncoding;

scene.background = texture;


const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(w, h);
renderer.outputEncoding = THREE.sRGBEncoding;


/////////////////////////////////////////
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;
controls.enableZoom = false;


////////////////////////////////////////
function assStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffcc,
    emissive: 0xffffcc,
  });
  const star = new THREE.Mesh(geometry, material);

  const radius = 300;
  const minDistance = 60;

  // Random point inside a spherical shell
  const phi = Math.random() * 2 * Math.PI;
  const costheta = Math.random() * 2 - 1;
  const theta = Math.acos(costheta);

  const r = minDistance + (radius - minDistance) * Math.cbrt(Math.random());

  const x = r * Math.sin(theta) * Math.cos(phi);
  const y = r * Math.sin(theta) * Math.sin(phi);
  const z = r * Math.cos(theta);

  star.position.set(x, y, z);
  scene.add(star);
}

Array(1000).fill().forEach(assStar);


/////////////////////////////////////
let scrollX = 0;
let scrollZ = 0;
let autoY = 0;

window.addEventListener('wheel', (event) => {
  scrollX += event.deltaY * 0.00002;
  scrollZ += event.deltaY * 0.00004;
});

///////////////////////////////////////////////
function animate() {
  requestAnimationFrame(animate);
  autoY += 0.0002;

  scene.rotation.x = scrollX;
  scene.rotation.z = scrollZ;
  scene.rotation.y = autoY;

  renderer.render(scene, camera);
  controls.update();
}

animate();