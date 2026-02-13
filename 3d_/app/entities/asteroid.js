import * as THREE from "three";
import { CelestialBody } from "./celestialBody.js";

export class Asteroid extends CelestialBody {
    constructor({
        size = 1,
        renderMode = "mesh",
        orbitNearRadius = 100,
        orbitFarRadius = 200,
        orbitalTilt = 0,
        orbitalSpeed = 0.001,
        axialRotationSpeed = 0.001,
        thickness = 10,
        detail = 0,
        parent = null,
        color = 0x888888
    } = {}) {
        // Random position in a ring/belt
        const radius = Math.random() * (orbitFarRadius - orbitNearRadius) + orbitNearRadius;
        const angle = Math.random() * Math.PI * 2;
        const height = (Math.random() - 0.5) * thickness; // vertical spread
        const posToParent = new THREE.Vector3(
            Math.cos(angle) * radius,
            height,
            Math.sin(angle) * radius
        );

        // Random size variation
        const finalSize = size * (0.5 + Math.random());

        // Create geometry
        const geometry = new THREE.IcosahedronGeometry(size, detail);
        const material = new THREE.MeshStandardMaterial({ color });

        super({
            size: finalSize,
            renderMode,
            posToParent,
            orbitalTilt,
            axialRotationSpeed,
            orbitalSpeed,
            geometry,
            surfMat: material,
            parent
        });
    }

    Dispose()
    {
        super.Dispose();
    }
}
