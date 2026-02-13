import * as THREE from "three";
import { Planet } from "../../entities/planet.js";
import { StarSystem } from "../../utils/starSystemHelper.js"
import { SkyBox } from "../../visuals/skyBox.js";
import { SpaceStation } from "../../entities/spaceStation.js";
import { Star } from "../../entities/star.js";


export class EarthOrbit
{
    constructor(scene, camera) 
    {
        StarSystem.timeFactor=1
        const sizeFactor = 1;
        this.earthSize = 1000 * sizeFactor;

        this.cameraSettings = {
            pos: { x:-this.earthSize * 2, y:0, z:this.earthSize * 2 },
            lookAt: { x:15000, y:0, z:10000 },
            fov: 40,
            near: 40,
            far: 25000
        };
        this.scene = scene;
        this.scene.background = SkyBox.Load("StarBox");
        this.camera = camera;

        this.objects = [];

        // Create Earth
        this.earth = new Planet({
            name: "earth",
            size: this.earthSize,
            posToParent: new THREE.Vector3(0, 0, 0),
            axialTilt: 23.44,
            axialRotationSpeed: StarSystem.AxialRotationInDays(1),
            detail: 8,
            hasClouds: true,
        });
        this.scene.add(this.earth.orbitPivot);
        this.objects.push(this.earth);

        // Create SomeSpaceStation
        this.spaceStation = new SpaceStation({
            name: "USSEnterprise",
            size: 5,
            posToParent: new THREE.Vector3(1100, 0, 0),
            pitch: 0,
            yaw: Math.PI,
            roll: Math.PI /2,
            orbitRadius: 1100,
            axialRotationSpeed: StarSystem.AxialRotationInDays(0.1),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(0.1),
            parent: this.earth.objectRoot
        });
        this.objects.push(this.spaceStation);

        // Create ISS
        this.spaceStation = new SpaceStation({
            name: "USSEnterprise",
            size: 5,
            posToParent: new THREE.Vector3(1200, 0, 0),
            pitch: 0,
            yaw: Math.PI,
            roll: Math.PI /2,
            orbitRadius: 1100,
            axialRotationSpeed: StarSystem.AxialRotationInDays(0.06),
            orbitalTilt: 51.64,
            orbitalSpeed: StarSystem.OrbitalRotationInDays(0.06),
            parent: this.earth.objectRoot
        });
        this.objects.push(this.spaceStation);

        // Create moon
        this.moon = new Planet({
            name: "moon",
            size: 270,
            posToParent: new THREE.Vector3(14000, 0, 0),
            axialTilt: 6.68,
            orbitalTilt: 5.145,
            axialRotationSpeed: StarSystem.AxialRotationInDays(27.3),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(27.3),
            detail: 3,
            parent: this.earth.objectRoot,
        });
        this.objects.push(this.moon);

        // Create Sun
        this.sun = new Star({
            name: "sun",
            size: 100,
            maxSizeOnScreen: 0.52,
            renderMode: "points",
            lightType: "directionalLight",
            targetObject: this.earth.objectRoot,
            posToParent: new THREE.Vector3(15000, 0, 10000),
            orbitalSpeed: StarSystem.OrbitalRotationInDays(365),
            temperature: 5778,
            sizeAtenuation: false,
            parent: this.earth.objectRoot,
        });
        this.objects.push(this.sun);
    }

    SimulationUpdate()
    {
        const earthPos = new THREE.Vector3();
        this.earth.objectRoot.getWorldPosition(earthPos);

        // Orbit parameters
        const orbitRadius = this.earthSize * 4;
        const orbitHeight = this.earthSize * 0.5;
        const orbitSpeed = 0.002;

        // Increment orbit angle
        this._orbitAngle = (this._orbitAngle || 0) + orbitSpeed;

        // Compute target orbit position
        const targetX = earthPos.x + Math.cos(this._orbitAngle) * orbitRadius;
        const targetY = earthPos.y + orbitHeight;
        const targetZ = earthPos.z + Math.sin(this._orbitAngle) * orbitRadius;
        const targetPos = new THREE.Vector3(targetX, targetY, targetZ);

        // Initialize transition if not yet started
        if (!this._transitioning) {
            this._camPosCurrent = this.camera.position.clone();   // start from current camera pos
            this._lookAtCurrent = new THREE.Vector3();
            this.camera.getWorldDirection(this._lookAtCurrent);   // get current camera look direction
            this._transitioning = true;
        }

        // Smooth transition
        if (this._transitioning) {
            this._camPosCurrent.lerp(targetPos, 0.02);
            this._lookAtCurrent.lerp(earthPos, 0.05);

            this.camera.position.copy(this._camPosCurrent);
            this.camera.lookAt(this._lookAtCurrent);

            // Stop transitioning if close enough
            if (this._camPosCurrent.distanceTo(targetPos) < 0.1) {
                this._transitioning = false;
            }
        } else {
            // Orbit normally
            this.camera.position.copy(targetPos);
            this.camera.lookAt(earthPos);
        }
    }


    Update(dt) 
    {
        this.objects.forEach(obj => obj.Update(dt));

        const earthWorldPos = new THREE.Vector3();
        this.earth.objectRoot.getWorldPosition(earthWorldPos);
        const distanceToEarth = this.camera.position.distanceTo(earthWorldPos);
        if (distanceToEarth > this.earthSize * 5) {
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
