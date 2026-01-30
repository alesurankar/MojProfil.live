import * as THREE from "three";
import { Asteroids } from "./objects/asteroids.js"
import { Planet } from "./objects/planet.js"
import { Star } from "./objects/star.js";
import { GameControls } from "./utils/gameControls.js"


///////////////////////////////////////////////
const scene = new THREE.Scene();
const w = window.innerWidth;
const h = window.innerHeight;
const fov = 30;
const aspect = w / h;
const near = 0.1;
const far = 20000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(w, h);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.physicallyCorrectLights = true;


const gameControls = new GameControls(camera, document.body, 0.5);

const appState = {
  mode: "simulation"
};
let solarSystemRunning = true;

export function enableSimulation() {
  appState.mode = "simulation";

  gameControls.enabled = false;
  solarSystemRunning = true;
}

export function enableGameMode() {
  appState.mode = "game";

  gameControls.enabled = true;
  solarSystemRunning = false;
}

window.enableGameMode = enableGameMode;
window.enableSimulation = enableSimulation;

// Ambient light, for simulation purposes
const ambientLight = new THREE.AmbientLight(
  0x404040,
  1.3
);
scene.add(ambientLight);

const FIXED_FPS = 40;
const FIXED_DT = 1 / FIXED_FPS;
let lastTime = performance.now() / 1000;
let accumulator = 0;

const axialTimeScale = 140;
function rotationSpeedFromDays(days, axialTimeScale) {
    const seconds = days * 24 * 60 * 60;
    return (2 * Math.PI / seconds) * axialTimeScale;
}

const orbitalTimeScale = 1000;
function orbitalSpeedFromDays(days, orbitalTimeScale) {
    const seconds = days * 24 * 60 * 60;
    return (2 * Math.PI / seconds) * orbitalTimeScale;
}

// Axial Speeds
const mercuryAxialSpeed = rotationSpeedFromDays(58.6, axialTimeScale);
const venusAxialSpeed   = -rotationSpeedFromDays(243, axialTimeScale);   // retrograde
const earthAxialSpeed   = rotationSpeedFromDays(1, axialTimeScale);
const moonAxialSpeed    = rotationSpeedFromDays(27.3, axialTimeScale);
const marsAxialSpeed    = rotationSpeedFromDays(1.03, axialTimeScale);
const jupiterAxialSpeed = rotationSpeedFromDays(0.41, axialTimeScale);
const saturnAxialSpeed  = rotationSpeedFromDays(0.45, axialTimeScale);
const uranusAxialSpeed  = -rotationSpeedFromDays(0.72, axialTimeScale);  // retrograde
const neptuneAxialSpeed = rotationSpeedFromDays(0.67, axialTimeScale);
const plutoAxialSpeed   = rotationSpeedFromDays(6.39, axialTimeScale);

// Orbitral Speeds
const mercuryOrbitalSpeed = orbitalSpeedFromDays(88, orbitalTimeScale);
const venusOrbitalSpeed   = orbitalSpeedFromDays(224.7, orbitalTimeScale);
const earthOrbitalSpeed   = orbitalSpeedFromDays(365.25, orbitalTimeScale);
const moonOrbitalSpeed    = orbitalSpeedFromDays(27.3, orbitalTimeScale);
const marsOrbitalSpeed    = orbitalSpeedFromDays(687, orbitalTimeScale);
const asteroidBeltOrbitalSpeed    = orbitalSpeedFromDays(1570, orbitalTimeScale);
const jupiterOrbitalSpeed = orbitalSpeedFromDays(4333, orbitalTimeScale);
const saturnOrbitalSpeed  = orbitalSpeedFromDays(10759, orbitalTimeScale);
const saturnRingOrbitalSpeed    = orbitalSpeedFromDays(0.6, orbitalTimeScale);
const uranusOrbitalSpeed  = orbitalSpeedFromDays(30687, orbitalTimeScale);
const uranusRingOrbitalSpeed    = -orbitalSpeedFromDays(0.26, orbitalTimeScale); //retrograde
const neptuneOrbitalSpeed = orbitalSpeedFromDays(60190, orbitalTimeScale);
const plutoOrbitalSpeed   = orbitalSpeedFromDays(90560, orbitalTimeScale);


const loader = new THREE.CubeTextureLoader();

const skybox = loader.load([
  './3D/textures/skybox/n1.png',
  './3D/textures/skybox/n2.png',
  './3D/textures/skybox/n3.png',
  './3D/textures/skybox/n4.png',
  './3D/textures/skybox/n5.png',
  './3D/textures/skybox/n6.png',
]);

scene.background = skybox;

// Create Sun
const sun = new Star({
  name: "sun",
  size: 100,
  position: new THREE.Vector3(0, 0, 0),
  temperature: 5778
});
scene.add(sun.group);


// Create Mercury
const mercury = new Planet({
  name: "mercury",
  size: 4,
  axialTilt: 0.034,
  axialRotationSpeed: mercuryAxialSpeed,
  orbitRadius: 400,
  orbitRotationSpeed: mercuryOrbitalSpeed,
  parent: sun.group,
});


// Create venus
const venus = new Planet({
  name: "venus",
  size: 9.5,
  axialTilt: 177.36,
  axialRotationSpeed: venusAxialSpeed,
  orbitRadius: 700,
  orbitRotationSpeed: venusOrbitalSpeed,
  parent: sun.group,
});


// Create earth
const earth = new Planet({
  name: "earth",
  size: 10,
  axialTilt: 23.44,
  axialRotationSpeed: earthAxialSpeed,
  cloudRotationSpeed: earthAxialSpeed * 0.3,
  orbitRadius: 1000,
  orbitRotationSpeed: earthOrbitalSpeed,
  nightOpacity: 0.4,
  cloudOpacity: 0.5,
  detail: 7,
  parent: sun.group,
});


// Create moon
const moon = new Planet({
  name: "moon",
  size: 2.7,
  axialTilt: 6.68,
  axialRotationSpeed: moonAxialSpeed,
  orbitRadius: 30,
  orbitRotationSpeed: moonOrbitalSpeed - earthAxialSpeed/2,
  parent: earth.group,
});


// Create mars
const mars = new Planet({
  name: "mars",
  size: 5.3,
  axialTilt: 25.19,
  axialRotationSpeed: marsAxialSpeed,
  orbitRadius: 1500,
  orbitRotationSpeed: marsOrbitalSpeed,
  parent: sun.group,
});


// Create asteroid belt
const asteroids = new Asteroids({
  asteroidCount: 9000,
  orbitFarRadius: 1900,
  orbitNearRadius: 1700,
  axialRotationSpeed: axialTimeScale * 0.000014,
  orbitRotationSpeed: asteroidBeltOrbitalSpeed,
  thickness: 50,
  size: 0.8,
  parent: sun.group,
});


// Create jupiter
const jupiter = new Planet({
  name: "jupiter",
  size: 38,
  axialTilt: 3.13,
  axialRotationSpeed: jupiterAxialSpeed,
  orbitRadius: 2600,
  orbitRotationSpeed: jupiterOrbitalSpeed,
  parent: sun.group,
});


// Create saturn
const saturn = new Planet({
  name: "saturn",
  size: 34,
  axialTilt: 26.73,
  axialRotationSpeed: saturnAxialSpeed,
  orbitRadius: 3600,
  orbitRotationSpeed: saturnOrbitalSpeed,
  parent: sun.group,
});


// Create saturn ring
const saturnRing = new Asteroids({
  asteroidCount: 5000,
  orbitFarRadius: 65,
  orbitNearRadius: 40,
  axialRotationSpeed: 0.005,
  orbitRotationSpeed: saturnRingOrbitalSpeed * 0.5, // 5x slower for simulation purpose
  thickness: 0.6,
  size: 0.16,
  roughness: 0.9,
  metalness: 0.0,
  color: 0xdfe6f0,
  parent: saturn.group,
});


// Create uranus
const uranus = new Planet({
  name: "uranus",
  size: 20,
  axialTilt: 97.77,
  axialRotationSpeed: uranusAxialSpeed,
  orbitRadius: 4600,
  orbitRotationSpeed: uranusOrbitalSpeed,
  parent: sun.group,
});


// Create uranus ring
const uranusRing = new Asteroids({
  asteroidCount: 1000,
  orbitFarRadius: 50,
  orbitNearRadius: 42,
  axialRotationSpeed: 0.003,
  orbitRotationSpeed: uranusRingOrbitalSpeed * 0.5, // 5x slower for simulation purpose
  thickness: 0.3,
  size: 0.14,
  //color: 0x444444, // real, to dark
  color: 0xffffff, // not real
  parent: uranus.group,
});


// Create neptune
const neptune = new Planet({
  name: "neptune",
  size: 19,
  axialTilt: 28.32,
  axialRotationSpeed: neptuneAxialSpeed,
  orbitRadius: 5600,
  orbitRotationSpeed: neptuneOrbitalSpeed,
  parent: sun.group,
});


// Create pluto
const pluto = new Planet({
  name: "pluto",
  size: 1.8,
  axialTilt: 119.61,
  axialRotationSpeed: plutoAxialSpeed,
  orbitRadius: 6500,
  orbitRotationSpeed: plutoOrbitalSpeed,
  parent: sun.group,
});


function focusOnPlanet(index) {
    if (index < 0 || index >= cameraTargets.length) return;

    currentTargetIndex = index;
    // Set the next target to the next planet in the array for smooth cycling
    nextTargetIndex = (index + 1) % cameraTargets.length;
}


let cameraTargets = [
    sun.group,
    mercury.group,
    venus.group,
    earth.group,
    moon.group,
    mars.group,
    jupiter.group,
    saturn.group,
    uranus.group,
    neptune.group,
    pluto.group,
];

let orbitAngle = 0;          // Current rotation around planet
let orbitRadius = 160;     // Distance from planet
let orbitHeight = 10;     // Height above planet
let orbitSpeed = 0.003;     // Rotation speed

let currentTargetIndex = 0;
let nextTargetIndex = 1;

// Lerp factor (controls speed of transition)
const lerpSpeed = 0.01; // smaller = slower

// Temporary vectors for calculations
const camPos = new THREE.Vector3();
const targetPos = new THREE.Vector3();
const currentLookAt = new THREE.Vector3();


let e = 0;


function updatePlanets() {
  // Get planet position
  cameraTargets[currentTargetIndex].getWorldPosition(targetPos);

  // Orbiting offset
  orbitAngle += orbitSpeed;
  const offsetX = Math.cos(orbitAngle) * orbitRadius;
  const offsetZ = Math.sin(orbitAngle) * orbitRadius;
  const offsetY = orbitHeight;
  const offset = new THREE.Vector3(offsetX, offsetY, offsetZ);

  // Desired camera position
  const desiredPos = targetPos.clone().add(offset);

  // Smooth camera movement
  camPos.lerpVectors(camera.position, desiredPos, lerpSpeed);
  camera.position.copy(camPos);

  // Smooth look at planet
  currentLookAt.lerpVectors(currentLookAt, targetPos, 0.01); // faster lerp
  camera.lookAt(currentLookAt);

  // Switch to next planet if close enough
  if (camera.position.distanceTo(desiredPos) < 1) {
      currentTargetIndex = nextTargetIndex;
      nextTargetIndex = (nextTargetIndex + 1) % cameraTargets.length;
      // reset orbit angle so camera orbit continues smoothly
      orbitAngle = 0;
  }

  if (e == -1000) {
    focusOnPlanet(0); // Sun
    orbitRadius = 1000; 
  }
  if (e == 0) {
    focusOnPlanet(1); // Mercury
    orbitRadius = 200; 
  }
  if (e == 1000) {
    focusOnPlanet(2); // Venus
    orbitRadius = 210; 
  }
  if (e == 2000) {
    focusOnPlanet(3); // Earth
    orbitRadius = 230; 
  }
  if (e == 3000) {
    focusOnPlanet(4); // Moon
    orbitRadius = 180; 
  }
  if (e == 4000) {
    focusOnPlanet(5); // Mars
    orbitRadius = 200; 
  }
  if (e == 5000) {
    focusOnPlanet(6); // Jupiter
    orbitRadius = 350; 
  }
  if (e == 6000) {
    focusOnPlanet(7); // Saturn
    orbitRadius = 320; 
  }
  if (e == 7000) {
    focusOnPlanet(8); // Uranus
    orbitRadius = 320; 
  }
  if (e == 8000) {
    focusOnPlanet(9); // Neptune
    orbitRadius = 300; 
  }
  if (e == 9000) {
    focusOnPlanet(10); // Pluto
    orbitRadius = 80; 
  }
  if (e == 10000) {
    e = -1200 
    focusOnPlanet(0); // Reset
    orbitRadius = 1000; 
  }
  e+=2;
}


function Update() {
  mercury.rotate();
  venus.rotate();
  earth.rotate();
  moon.rotate();
  mars.rotate();
  asteroids.update();
  jupiter.rotate();
  saturn.rotate();
  saturnRing.update();
  uranus.rotate();
  uranusRing.update();
  neptune.rotate();
  pluto.rotate();

  if (solarSystemRunning) {
    updatePlanets();
  }

  if (appState.mode === "game") {
    gameControls.update();
  }
}


// ///////////////////////////////////////////////
function animate(now) {
  requestAnimationFrame(animate);

  const currentTime = now / 1000;
  let frameTime = currentTime - lastTime;
  lastTime = currentTime;

  frameTime = Math.min(frameTime, 0.25);
  accumulator += frameTime;

  while (accumulator >= FIXED_DT) {
    Update(); // fixed-step update
    accumulator -= FIXED_DT;
  }

  renderer.render(scene, camera);
}

requestAnimationFrame(animate);