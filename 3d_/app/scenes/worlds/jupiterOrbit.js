import * as THREE from "three";
import { Planet } from "../../entities/planet.js";
import { StarSystem } from "../../utils/starSystemHelper.js"
import { SkyBox } from "../../visuals/skyBox.js";
import { Star } from "../../entities/star.js";


export class JupiterOrbit
{
    constructor(scene, camera) 
        {
            StarSystem.timeFactor=1
            const sizeFactor = 1;
            this.jupiterSize = 3800 * sizeFactor;

            this.cameraSettings = {
                pos: { x:-this.jupiterSize * 2, y:0, z:this.jupiterSize * 2 },
                lookAt: { x:15000, y:0, z:10000 },
                fov: 40,
                near: 100,
                far: 34000
            };
            this.scene = scene;
            this.scene.background = SkyBox.Load("StarBox");
            this.camera = camera;
    
            this.objects = [];
        

            // Create Jupiter
            this.jupiter = new Planet({
                name: "jupiter",
                size: this.jupiterSize,
                posToParent: new THREE.Vector3(0, 0, 0),
                axialTilt: 3.13,
                orbitalTilt: 1.31,
                axialRotationSpeed: StarSystem.AxialRotationInDays(0.41),
                detail: 8,
                hasClouds: false,
            });
            this.scene.add(this.jupiter.orbitPivot);
            this.objects.push(this.jupiter);

            // Create Sun
            this.sun = new Star({
                name: "sun",
                size: 100,
                maxSizeOnScreen: 0.1018,
                renderMode: "points",
                lightType: "directionalLight",
                targetObject: this.jupiter.objectRoot,
                posToParent: new THREE.Vector3(15000, 0, 10000),
                orbitalTilt: 1.31,
                orbitalSpeed: StarSystem.OrbitalRotationInDays(4333),
                temperature: 5778,
                sizeAtenuation: false,
                parent: this.jupiter.objectRoot,
            });
            this.objects.push(this.sun);
        }
    Update(dt) 
        {
            this.objects.forEach(obj => obj.Update(dt));

            const jupiterWorldPos = new THREE.Vector3();
            this.jupiter.objectRoot.getWorldPosition(jupiterWorldPos);
            const distanceToJupiter = this.camera.position.distanceTo(jupiterWorldPos);
            if (distanceToJupiter > this.jupiterSize * 5) {
                this.requestedScene = "SolarSystem";
            } 
        }
    
        Dispose() 
        {
            this.objects.forEach(obj => obj?.Dispose());
            this.objects = [];
            
            // Dispose skybox
            if (this.scene?.background) {
                SkyBox.Dispose(this.scene.background);
                this.scene.background = null;
            }
        }
}