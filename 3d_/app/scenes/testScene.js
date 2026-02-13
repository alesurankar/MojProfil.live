import * as THREE from "three";
import { Planet } from "../entities/planet.js";
import { Star } from "../entities/star.js";
import { StarSystem } from "../utils/starSystemHelper.js"
import { SkyBox } from "../visuals/skyBox.js";
import { Asteroid } from "../entities/asteroid.js";

export class TestScene
{
    constructor(scene, camera) 
    {
        StarSystem.timeFactor=100
       
        this.cameraSettings = {
            pos: { x:1000, y:100, z:-200 },
            lookAt: { x:800, y:0, z:0 },
            fov: 40,
            near: 20,
            far: 20000
        };
        this.scene = scene;
        this.scene.background = SkyBox.Load("StarBox");
        this.camera = camera;

        // Create Sun
        this.sun = new Star({
            name: "sun",
            size: 110,
            lightType: "pointLight",
            posToParent: new THREE.Vector3(0, 0, 0),
            axialTilt: 7.25,
            axialRotationSpeed: StarSystem.AxialRotationInDays(25),
            orbitalSpeed: 0,
            temperature: 5778,
            hasTexture: true,
        });
        this.scene.add(this.sun.orbitPivot);

        // Create Earth
        this.earth = new Planet({
            name: "earth",
            size: 10,
            posToParent: new THREE.Vector3(500, 0, 0),
            axialTilt: 23.44,
            orbitalTilt: 0,
            axialRotationSpeed: StarSystem.AxialRotationInDays(1),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(365.25),
            parent: this.sun.objectRoot,
        });

        // Create moon
        this.moon = new Planet({
            name: "moon",
            size: 2.7,
            posToParent: new THREE.Vector3(30, 0, 0),
            axialTilt: 6.68,
            orbitalTilt: 5.145,
            axialRotationSpeed: StarSystem.AxialRotationInDays(27.3),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(27.3),
            parent: this.earth.objectRoot,
        });

        // Create asteroid belt
        this.asteroids = [];
        const asteroidCount = 3000;
        for (let i = 0; i < asteroidCount; i++) {
            const asteroid = new Asteroid({
                size: 1,
                orbitFarRadius: 1300,
                orbitNearRadius: 1000,
                orbitalTilt: 0.0,
                axialRotationSpeed: 0.0004,
                orbitalSpeed: StarSystem.OrbitalRotationInDays(1570),
                thickness: 50,
                parent: this.sun.objectRoot
            });
            this.asteroids.push(asteroid);
        }
        
        // Create saturn
        this.saturn = new Planet({
            name: "saturn",
            size: 34,
            posToParent: new THREE.Vector3(800, 0, 0),
            axialTilt: 26.73,
            orbitalTilt: 2.49,
            axialRotationSpeed: StarSystem.AxialRotationInDays(0.45),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(10759),
            parent: this.sun.objectRoot,
        });

        // // Create saturn ring
        this.saturnRing = [];
        const saturnRingCount = 3000;
        for (let i = 0; i < saturnRingCount; i++) {
            const ringParticle  = new Asteroid({
                size: 0.5,
                orbitFarRadius: 65,
                orbitNearRadius: 40,
                orbitalTilt: 0,
                axialRotationSpeed: 0.005,
                orbitalSpeed: StarSystem.OrbitalRotationInDays(0.6),
                thickness: 0.6,   
                color: 0xdfe6f0,
                parent: this.saturn.axialFrame
            });
            this.saturnRing.push(ringParticle );
        }
    }

    Update(dt) 
    {
        this.sun.Update(dt);
        this.earth.Update(dt);
        this.moon.Update(dt);
        for (const asteroid of this.asteroids) {
            asteroid.Update(dt);
        }
        this.saturn.Update(dt);
        for (const ringParticle of this.saturnRing) {
            ringParticle.Update(dt);
        }

    }

    Dispose() 
    {
        // Remove Sun
        if (this.sun) {
            this.sun.Dispose();
            this.sun = null;
        }
        // Remove Earth
        if (this.earth) {
            this.earth.Dispose();
            this.earth = null;
        }
        // Remove Moon
        if (this.moon) {
            this.moon.Dispose();
            this.moon = null;
        }
        // Remove Asteroid Belt
        for (const asteroid of this.asteroids) {
            asteroid.Dispose();
        }
        this.asteroids = [];
        // Remove Saturn
        if (this.saturn) {
            this.saturn.Dispose();
            this.saturn = null;
        }
        // Remove Saturn Ring
        for (const ringParticle  of this.saturnRing) {
            ringParticle.Dispose();
        }
        this.saturnRing = [];
        // Dispose skybox
        if (this.scene?.background) {
            SkyBox.Dispose(this.scene.background);
            this.scene.background = null;
        }
    }
}