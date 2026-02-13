import * as THREE from "three";
import { CelestialBody } from "./celestialBody.js";


export class BlackHole extends CelestialBody 
{
    constructor({
        name = "blackHole",
        size = 10,
        posToParent = new THREE.Vector3(0, 0, 0),
        facingTo = new THREE.Vector3(0, -1, 0),
        axialRotationSpeed = 0.01,
        orbitalSpeed = 0,
        parent = null,
    } = {}) 
    {
        // Prepare texture and material
        const texture = new THREE.TextureLoader().load("./3d_/app/textures/blackHole.png");

        // Use a plane as the geometry
        const geometry = new THREE.PlaneGeometry(size, size);

        const surfMat = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide,
        });

        // Call base constructor
        super({
            size,
            renderMode: "mesh",
            posToParent,
            axialRotationSpeed,
            orbitalSpeed,
            surfMat,
            geometry,
            parent,
        });
        this.body.lookAt(facingTo);
    }

    Update(dt) 
    {
        this.body.rotation.z -= this.axialRotationSpeed * dt;
    }
    
    Dispose()
    {
        super.Dispose();
    }
}