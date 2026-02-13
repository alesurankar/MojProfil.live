import * as THREE from "three";
import { CelestialBody } from "./celestialBody.js";


export class Planet extends CelestialBody 
{
    constructor({
        name = "planet",
        size = 4,
        renderMode = "mesh",
        posToParent = new THREE.Vector3(700, 0, 0),
        axialTilt = 0,
        orbitalTilt = 0,
        axialRotationSpeed = 0,
        orbitalSpeed = 0,
        detail = 4,
        color = 0xffffff,
        hasClouds = false,
        parent = null,
    } = {}) 
    {
        // Prepare texture and material
        let surfMat = null;
        let cloudMat = null;
        const loader = new THREE.TextureLoader();
    
        const surfTexture = `./3d_/app/textures/${name}/day.jpg`;   
        const surfTex = loader.load(surfTexture);
        surfMat = new THREE.MeshStandardMaterial({
            map: surfTex,
            roughness: 1,
            metalness: 0,
            color,  
        });

        // Cloud material
        if (hasClouds) {
            const cloudTexture = `./3d_/app/textures/${name}/clouds.jpg`;
            const cloudTex = loader.load(cloudTexture);
            cloudMat = new THREE.MeshStandardMaterial({
                map: cloudTex,
                transparent: true,
                opacity: 0.4,
                blending: THREE.NormalBlending
            });
        }
        
         // Create geometry
        const geometry = new THREE.IcosahedronGeometry(size, detail);

        super({
            size,
            renderMode,
            posToParent,
            axialTilt,
            orbitalTilt,
            axialRotationSpeed,
            orbitalSpeed,
            surfMat,
            cloudMat,
            geometry,
            parent,
        });
    }

    Dispose()
    {
        super.Dispose();
    }
}
