import * as THREE from "three";
import { Star } from "../../entities/star.js";
import { StarSystem } from "../../utils/starSystemHelper.js"
import { SkyBox } from "../../visuals/skyBox.js";
import { BlackHole } from "../../entities/blackHole.js";

export class AlphaCenturySystem 
{
    constructor(scene, camera) 
    {
        StarSystem.timeFactor=100
       
        this.cameraSettings = {
            pos: { x:1500, y:1500, z:0 },
            lookAt: { x:0, y:0, z:0 },
            fov: 40,
            near: 20,
            far: 20000
        };
        this.scene = scene;
        this.scene.background = SkyBox.Load("StarBox");
        this.camera = camera;

        this.objects = [];
        const sizeFactor = 0.5
        const wormholeSize = 100 * sizeFactor;

        // Create BaryCenter
        this.barycenter = new THREE.Group();
        this.scene.add(this.barycenter);

        // Create Alpha Century A
        this.acA = new Star({
            size: 110,
            posToParent: new THREE.Vector3(900, 0, 0),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(283),
            temperature: 5790,
            parent: this.barycenter,
        });
        this.objects.push(this.acA);

        // Create Alpha Century B
        this.acB = new Star({
            size: 90,
            posToParent: new THREE.Vector3(-720, 0, 0),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(283),
            temperature: 5200,
            parent: this.barycenter,
        });
        this.objects.push(this.acB);

        // Create Proxima Centauri
        this.pc = new Star({
            size: 30,
            posToParent: new THREE.Vector3(8000, 0, 0),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(365000),
            temperature: 3000,
            parent: this.barycenter,
        });
        this.objects.push(this.pc);

        // Create Wormhole
        this.wormhole = new BlackHole({
            size: wormholeSize,
            posToParent: new THREE.Vector3(2000, 2000, 0),
            facingTo: new THREE.Vector3(0, 0, 0),
            parent: this.barycenter,
        });
        this.objects.push(this.wormhole);

        this.sceneTriggers = [
            { obj: this.wormhole, threshold: wormholeSize / 2, scene: "MilkyWay" },
        ];
    }
    
    Update(dt) 
    {
        for (const obj of this.objects) {
            obj.Update(dt);
        }

        for (const trigger of this.sceneTriggers) {
            const worldPos = new THREE.Vector3();
            trigger.obj.objectRoot.getWorldPosition(worldPos);
            const distance = this.camera.position.distanceTo(worldPos);
            if (distance <= trigger.threshold) {
                this.requestedScene = trigger.scene;
                break; 
            }
        }
    }

    Dispose() 
    {
        this.objects.forEach(obj => obj?.Dispose());
        this.objects = [];
        this.sceneTriggers = [];

        if (this.barycenter) {
            this.barycenter.clear();
            this.scene.remove(this.barycenter);
            this.barycenter = null;
        }

        // Dispose skybox
        if (this.scene?.background) {
            SkyBox.Dispose(this.scene.background);
            this.scene.background = null;
        }
    }
}