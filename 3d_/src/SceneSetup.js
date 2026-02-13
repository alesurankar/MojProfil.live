import * as THREE from "three";
import { SolarSystem } from "../app/scenes/starSystems/solarSystem.js";
import { SceneManager } from "./SceneManager.js";
import { Camera } from "./RendererSetup.js";


// Scene
export const Scene = new THREE.Scene();
 
const ambientLight = new THREE.AmbientLight(0x404040, 2);
Scene.add(ambientLight);

const manager = new SceneManager(Scene, Camera);

manager.LoadScene(SolarSystem);

export function Update(timeScale, mode) 
{
    manager.Update(timeScale);
    if (mode === "simulation") {
        manager.SimulationUpdate();
    }
}