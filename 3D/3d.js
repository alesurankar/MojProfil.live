import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";


///////////////////////////////////////////////
const scene = new THREE.Scene();
const w = window.innerWidth;
const h = window.innerHeight;
const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 2000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 0, 400);


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



///////////////////////////////////////////////
// GPU-friendly stars using Points
const starCount = 10000;
const positions = new Float32Array(starCount * 3);
const colors = new Float32Array(starCount * 3);
const radius = 1200;
const minDistance = 200;

// generate positions inside spherical shell
for (let i = 0; i < starCount; i++) {
  const phi = Math.random() * 2 * Math.PI;
  const costheta = Math.random() * 2 - 1;
  const theta = Math.acos(costheta);
  const r = minDistance + (radius - minDistance) * Math.cbrt(Math.random());

  const x = r * Math.sin(theta) * Math.cos(phi);
  const y = r * Math.sin(theta) * Math.sin(phi);
  const z = r * Math.cos(theta);

  positions[i * 3] = x;
  positions[i * 3 + 1] = y;
  positions[i * 3 + 2] = z;

  const intensity = 0.8 + Math.random() * 0.2;
  colors[i * 3] = 1.0 * intensity;      // r
  colors[i * 3 + 1] = 1.0 * intensity;  // g
  colors[i * 3 + 2] = 0.8 * intensity;  // b (slightly yellowish)
}

const starGeometry = new THREE.BufferGeometry();
starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const starMaterial = new THREE.PointsMaterial({
  size: 0.5,            // star size
  vertexColors: true,    // use the color buffer
  transparent: true,
  blending: THREE.AdditiveBlending, // glow effect
});

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);



/////////////////////////////////////
let scrollX = 0;
let scrollZ = 0;
let autoY = 0;

window.addEventListener('wheel', (event) => {
  scrollX += event.deltaY * 0.00002;
  scrollZ += event.deltaY * 0.00004;
});


////////////////////////////////////
const frustum = new THREE.Frustum();
const cameraViewProjectionMatrix = new THREE.Matrix4();


///////////////////////////////////////////////
function animate() {
  requestAnimationFrame(animate);
  autoY += 0.00034;

  scene.rotation.x = scrollX;
  scene.rotation.z = scrollZ;
  scene.rotation.y = autoY;

  renderer.render(scene, camera);
  controls.update();
}

animate();