import * as THREE from "three";
import { BlackHole } from "../../entities/blackHole.js";
import { Star } from "../../entities/star.js";
import { StarSystem } from "../../utils/starSystemHelper.js"
import { SkyBox } from "../../visuals/skyBox.js";

export class MilkyWay
{
    constructor(scene, camera) 
    {
        StarSystem.timeFactor=250

        this.cameraSettings = {
            pos: { x:-1000, y:1000, z:1000 },
            lookAt: { x:0, y:0, z:0 },
            fov: 40,
            near: 20,
            far: 20000
        };
        this.scene = scene;
        this.scene.background = SkyBox.Load("GalaxyBox");
        this.camera = camera;

        const galaxyRadius = 60000;

        const baseSpeed = StarSystem.OrbitalRotationInDays(250);
        const starNum = 2000;
        const redDwarfNum = starNum * 0.72;
        const K_typeNum = starNum * 0.14;
        const G_typeNum = starNum * 0.08;
        const F_typeNum = starNum * 0.03;
        const A_typeNum = starNum * 0.007;
        const redMasiveNum = starNum * 0.0006;


        // Scale constants
        const SIZE_SCALE = 4;
        const DISTANCE_SCALE = 0.1; // 1 unit = 1 light-year
        const LOCAL_SCALE = 200; // scale down small interstellar distances
        const sunPos = new THREE.Vector3(26700 * DISTANCE_SCALE, 0, 0);

        this.objects = [];
        const SMBHSize = 100 * SIZE_SCALE;
        const sunSize = 0.1 * SIZE_SCALE;
        const alphaCentauriASize = 0.08 * SIZE_SCALE;
        const alphaCentauriBSize = 0.08 * SIZE_SCALE;
        const proximaCentauri = 0.07 * SIZE_SCALE;


        // Create SMBH
        this.SMBH = new BlackHole({
            name: "SMBH",
            size: SMBHSize,
            posToParent: new THREE.Vector3(0, 0, 0),
            axialRotationSpeed: baseSpeed * DISTANCE_SCALE * 30,
        });
        this.scene.add(this.SMBH.orbitPivot);
        this.objects.push(this.SMBH);

        // Create Sun
        this.sun = new Star({
            size: sunSize,
            renderMode: "points",
            posToParent: sunPos,
            orbitalSpeed: baseSpeed,
            detail: 0,
            temperature: 5778,
            parent: this.SMBH.objectRoot,
        });
        this.objects.push(this.sun);

        this.alphaCentauriA = new Star({
            size: alphaCentauriASize,
            renderMode: "points",
            posToParent: new THREE.Vector3(sunPos.x + 3.5*LOCAL_SCALE, sunPos.y - 1.2*LOCAL_SCALE + 0.02*LOCAL_SCALE, sunPos.z-1.0*LOCAL_SCALE + 0.02*LOCAL_SCALE),
            orbitalSpeed: baseSpeed,
            detail: 0,
            temperature: 5790,
            parent: this.SMBH.objectRoot,
        });
        this.objects.push(this.alphaCentauriA);

        this.alphaCentauriB = new Star({
            size: alphaCentauriBSize,
            renderMode: "points",
            posToParent: new THREE.Vector3(sunPos.x + 3.5*LOCAL_SCALE, sunPos.y - 1.2*LOCAL_SCALE - 0.02*LOCAL_SCALE, sunPos.z - 1.0*LOCAL_SCALE + 0.02*LOCAL_SCALE),
            orbitalSpeed: baseSpeed,
            detail: 0,
            temperature: 5200,
            parent: this.SMBH.objectRoot,
        });
        this.objects.push(this.alphaCentauriB);

        this.proximaCentauri = new Star({
            size: proximaCentauri,
            renderMode: "points",
            posToParent: new THREE.Vector3(sunPos.x + 3.5*LOCAL_SCALE, sunPos.y - 1.2*LOCAL_SCALE, sunPos.z - 1.05*LOCAL_SCALE - 0.02*LOCAL_SCALE),
            orbitalSpeed: baseSpeed,
            detail: 0,
            temperature: 3000,
            parent: this.SMBH.objectRoot,
        });
        this.objects.push(this.proximaCentauri);

        // Create redDwarfs
        for (let i = 0, z = redDwarfNum; i < redDwarfNum; i++, z--) {
            const size = this.randomBetween(0.01 * SIZE_SCALE, 0.05 * SIZE_SCALE);
            const radius = this.randomBetween(DISTANCE_SCALE * 700, DISTANCE_SCALE * galaxyRadius);
            const falloff = 0.7;
            const angularSpeed = baseSpeed * Math.sqrt((DISTANCE_SCALE * 10000) / radius, falloff);
            const star = new Star({
                name: `redDwarf${i}`,
                size: size,
                renderMode: "points",
                posToParent: new THREE.Vector3(
                    Math.cos(i) * radius,
                    this.randomBetween(-5, 5),
                    Math.sin(i) * radius
                ),
                orbitalSpeed: angularSpeed * this.randomBetween(0.9, 1.1),
                detail: 0,
                temperature: this.randomBetween(2500, 3300),
                parent: this.SMBH.objectRoot,
            });
            this.objects.push(star);
        }   

        // Create K_type stars
        for (let i = 0, z = K_typeNum; i < K_typeNum; i++, z--) {
            const size = this.randomBetween(0.05 * SIZE_SCALE, 0.09 * SIZE_SCALE);
            const radius = this.randomBetween(DISTANCE_SCALE * 700, DISTANCE_SCALE * galaxyRadius);
            const falloff = 0.7;
            const angularSpeed = baseSpeed * Math.sqrt((DISTANCE_SCALE * 10000) / radius, falloff);
            const star = new Star({
                name: `K_type${i}`,
                size: size,
                renderMode: "points",
                posToParent: new THREE.Vector3(
                    Math.cos(i) * radius,
                    this.randomBetween(-5, 5),
                    Math.sin(i) * radius
                ),
                orbitalSpeed: angularSpeed * this.randomBetween(0.9, 1.1),
                detail: 0,
                temperature: this.randomBetween(3300, 4600),
                parent: this.SMBH.objectRoot,
            });
            this.objects.push(star);
        }  

        // Create G_type stars
        for (let i = 0, z = G_typeNum; i < G_typeNum; i++, z--) {
            const size = this.randomBetween(0.09 * SIZE_SCALE, 0.12 * SIZE_SCALE);
            const radius = this.randomBetween(DISTANCE_SCALE * 700, DISTANCE_SCALE * galaxyRadius);
            const falloff = 0.7;
            const angularSpeed = baseSpeed * Math.sqrt((DISTANCE_SCALE * 10000) / radius, falloff);
            const star = new Star({
                name: `G_type${i}`,
                size: size,
                renderMode: "points",
                posToParent: new THREE.Vector3(
                    Math.cos(i) * radius,
                    this.randomBetween(-5, 5),
                    Math.sin(i) * radius
                ),
                orbitalSpeed: angularSpeed * this.randomBetween(0.9, 1.1),
                detail: 0,
                temperature: this.randomBetween(4600, 6200),
                parent: this.SMBH.objectRoot,
            });
            this.objects.push(star);
        }   

        // Create F_type stars
        for (let i = 0, z = F_typeNum; i < F_typeNum; i++, z--) {
            const size = this.randomBetween(0.1 * SIZE_SCALE, 0.2 * SIZE_SCALE);
            const radius = this.randomBetween(DISTANCE_SCALE * 700, DISTANCE_SCALE * galaxyRadius);
            const falloff = 0.7;
            const angularSpeed = baseSpeed * Math.sqrt((DISTANCE_SCALE * 10000) / radius, falloff);
            const star = new Star({
                name: `F_type${i}`,
                size: size,
                renderMode: "points",
                posToParent: new THREE.Vector3(
                    Math.cos(i) * radius,
                    this.randomBetween(-5, 5),
                    Math.sin(i) * radius
                ),
                orbitalSpeed: angularSpeed * this.randomBetween(0.9, 1.1),
                detail: 0,
                temperature: this.randomBetween(6200, 7500),
                parent: this.SMBH.objectRoot,
            });
            this.objects.push(star);
        }   

        // Create A_type stars
        for (let i = 0, z = A_typeNum; i < A_typeNum; i++, z--) {
            const size = this.randomBetween(0.2 * SIZE_SCALE, 0.5 * SIZE_SCALE);
            const radius = this.randomBetween(DISTANCE_SCALE * 700, DISTANCE_SCALE * galaxyRadius);
            const falloff = 0.7;
            const angularSpeed = baseSpeed * Math.sqrt((DISTANCE_SCALE * 10000) / radius, falloff);
            const star = new Star({
                name: `A_type${i}`,
                size: size,
                renderMode: "points",
                posToParent: new THREE.Vector3(
                    Math.cos(i) * radius,
                    this.randomBetween(-5, 5),
                    Math.sin(i) * radius
                ),
                orbitalSpeed: angularSpeed * this.randomBetween(0.9, 1.1),
                detail: 0,
                temperature: this.randomBetween(7500, 10000),
                parent: this.SMBH.objectRoot,
            });
            this.objects.push(star);
        }   

        // Create redMasive stars
        for (let i = 0, z = redMasiveNum; i < redMasiveNum; i++, z--) {
            const size = this.randomBetween(0.5 * SIZE_SCALE, 1 * SIZE_SCALE);
            const radius = this.randomBetween(DISTANCE_SCALE * 700, DISTANCE_SCALE * galaxyRadius);
            const falloff = 0.7;
            const angularSpeed = baseSpeed * Math.sqrt((DISTANCE_SCALE * 10000) / radius, falloff);
            const star = new Star({
                name: `redMasive${i}`,
                size: size,
                renderMode: "points",
                posToParent: new THREE.Vector3(
                    Math.cos(i) * radius,
                    this.randomBetween(-5, 5),
                    Math.sin(i) * radius
                ),
                orbitalSpeed: angularSpeed * this.randomBetween(0.9, 1.1),
                detail: 0,
                temperature: this.randomBetween(2000, 3000),
                parent: this.SMBH.objectRoot,
            });
            this.objects.push(star);
        }   

        this.sceneTriggers = [
            { obj: this.sun, threshold: sunSize * 100, scene: "SolarSystem" },
            { obj: this.alphaCentauriA, threshold: alphaCentauriASize * 100, scene: "AlphaCenturySystem" },
        ];
    }
    
    randomBetween(min, max) {
        return Math.random() * (max - min) + min;
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
        for (const obj of this.objects) {
            obj.Dispose();
        }
        this.objects = [];
        this.sceneTriggers = [];
        
        // Dispose skybox
        if (this.scene?.background) {
            SkyBox.Dispose(this.scene.background);
            this.scene.background = null;
        }
    }
}