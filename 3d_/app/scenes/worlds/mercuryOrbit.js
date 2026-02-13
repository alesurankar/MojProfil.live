import * as THREE from "three";
import { Planet } from "../../entities/planet.js";
import { StarSystem } from "../../utils/starSystemHelper.js"
import { SkyBox } from "../../visuals/skyBox.js";
import { Star } from "../../entities/star.js";


export class MercuryOrbit
{
    constructor(scene, camera) 
        {
            StarSystem.timeFactor=1
            const sizeFactor = 1;
            this.mercurySize = 400 * sizeFactor;

            this.cameraSettings = {
                pos: { x:-this.mercurySize * 2, y:0, z:this.mercurySize * 2 },
                lookAt: { x:15000, y:0, z:10000 },
                fov: 40,
                near: 30,
                far: 20000
            };
            this.scene = scene;
            this.scene.background = SkyBox.Load("StarBox");
            this.camera = camera;
    
            this.objects = [];
        
            // Create Mercury
            this.mercury = new Planet({
                name: "mercury",
                size: this.mercurySize,
                posToParent: new THREE.Vector3(0, 0, 0),
                axialTilt: 0.034,
                axialRotationSpeed: StarSystem.AxialRotationInDays(58.6),
                detail: 8,
                hasClouds: false,
            });
            this.scene.add(this.mercury.orbitPivot);
            this.objects.push(this.mercury);

            // Create Sun
            this.sun = new Star({
                name: "sun",
                size: 100,
                maxSizeOnScreen: 1.37,
                renderMode: "points",
                lightType: "directionalLight",
                targetObject: this.mercury.objectRoot,
                posToParent: new THREE.Vector3(15000, 0, 10000),
                orbitalTilt: 7.00,
                orbitalSpeed: StarSystem.OrbitalRotationInDays(88),
                temperature: 5778,
                sizeAtenuation: false,
                parent: this.mercury.objectRoot,
            });
            this.objects.push(this.sun);
        }
    Update(dt) 
        {
            this.objects.forEach(obj => obj.Update(dt));

            const mercuryWorldPos = new THREE.Vector3();
            this.mercury.objectRoot.getWorldPosition(mercuryWorldPos);
            const distanceToMercury = this.camera.position.distanceTo(mercuryWorldPos);
            if (distanceToMercury > this.mercurySize * 5) {
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