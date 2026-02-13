import * as THREE from "three";


export class ArtificialObject
{
    constructor(
    {
        renderMode = "mesh",
        posToParent = new THREE.Vector3(100, 0, 0),
        axialTilt = 0,
        orbitalTilt = 0,
        axialRotationSpeed = 0,
        orbitalSpeed = 0,
        surfMat = null,
        geometry = null,
        parent = null, 
    } = {}) 
    {
        if (renderMode === "points") {
           this.body = new THREE.Points(geometry, surfMat);
        }
        else if (renderMode === "mesh") {
            this.body = new THREE.Mesh(geometry, surfMat);
        }
        else if (renderMode === "model") {
            this.body = new THREE.Group(); // placeholder
        }
        
        // Create the groups
        this.orbitPivot = new THREE.Group();   // orbit
        this.objectRoot = new THREE.Group();   // position
        this.axialFrame = new THREE.Group();   // tilt
        
        // Assemble hierarchy
        this.axialFrame.add(this.body);
        this.objectRoot.add(this.axialFrame);
        this.orbitPivot.add(this.objectRoot);

        // Set rotation and position
        this.orbitalSpeed = orbitalSpeed;
        this.axialTilt = axialTilt * Math.PI / 180;
        this.orbitalTilt = orbitalTilt * Math.PI / 180;
        this.axialRotationSpeed = axialRotationSpeed - orbitalSpeed;
        this.axialFrame.rotation.z = this.axialTilt;
        this.orbitPivot.rotation.x = this.orbitalTilt;
        this.objectRoot.position.copy(posToParent)

        // Add to parent if any
        if (parent) parent.add(this.orbitPivot);
    }

    Update(dt) 
    {
        // Orbit parent
        this.orbitPivot.rotation.y += this.orbitalSpeed * dt;

        // Spin around own axis
        this.body.rotation.y += this.axialRotationSpeed * dt;
    }

    Dispose() 
    {
        if (this.body) {
            if (this.body.geometry) this.body.geometry.dispose();
            if (this.body.material) {
                if (Array.isArray(this.body.material)) {
                    this.body.material.forEach(m => {
                        if (m.map) m.map.dispose();
                        m.dispose();
                    });
                } else {
                    if (this.body.material.map) this.body.material.map.dispose();
                    this.body.material.dispose();
                }
            }
        }

        // Remove from parent
        this.orbitPivot.clear();
        this.orbitPivot.parent?.remove(this.orbitPivot);

        // Null references
        this.body = null;
        this.geometry = null;
        this.orbitPivot = null;
        this.objectRoot = null;
        this.axialFrame = null;
    }
}