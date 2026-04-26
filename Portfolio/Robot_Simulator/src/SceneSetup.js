import * as THREE from "three";
import { SceneManager } from "./SceneManager.js";
import { Camera } from "./RendererSetup.js";
import { TestScene } from "../app/scenes/testScene.js";


// Scene
export const Scene = new THREE.Scene();
 
const ambientLight = new THREE.AmbientLight(0xddffff, 0.5);
Scene.add(ambientLight);

const dirLight1 = new THREE.DirectionalLight(0xffddff, 2);
dirLight1.position.set(50, 100, 50);
dirLight1.castShadow = true;
Scene.add(dirLight1);

const dirLight2 = new THREE.DirectionalLight(0xffffdd, 2);
dirLight2.position.set(-50, 100, 50);
dirLight2.castShadow = true;
Scene.add(dirLight2);

function setupShadowLight(light) 
{
  light.castShadow = true;

  // shadow resolution (important for quality)
  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;

  // shadow camera volume (THIS is your main issue)
  light.shadow.camera.near = 1;
  light.shadow.camera.far = 1000;

  light.shadow.camera.left = -50;
  light.shadow.camera.right = 50;
  light.shadow.camera.top = 50;
  light.shadow.camera.bottom = -50;
}
setupShadowLight(dirLight1);
setupShadowLight(dirLight2);

const manager = new SceneManager(Scene, Camera);

manager.LoadScene(TestScene);

export function Update(dt, blackboard) 
{
  manager.Update(dt, blackboard);
}