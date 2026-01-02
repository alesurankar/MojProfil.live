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


///////////////////////////////////////////////
const pointLight = new THREE.PointLight(0xffffff, 100);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(pointLight, ambientLight);


/////////////////////////////////////////
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;
controls.enableZoom = false;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
  // normalize mouse coords (-1 to +1)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    const selected = intersects[0].object;
    console.log('Selected:', selected);

    selected.material.color.set(0xff0000);
  }
});

////////////////////////////////////////
function assStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({
  color: 0xffff00,
  emissive: 0xffff00,
});
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(assStar);


/////////////////////////////////////
let scrollZ = 0;
let autoY = 0;

window.addEventListener('wheel', (event) => {
  scrollZ += event.deltaY * 0.0001;
});

///////////////////////////////////////////////
function animate() {
  requestAnimationFrame(animate);
  autoY += 0.0008;

  scene.rotation.z = scrollZ;
  scene.rotation.y = autoY;

  renderer.render(scene, camera);
  controls.update();
}

animate();