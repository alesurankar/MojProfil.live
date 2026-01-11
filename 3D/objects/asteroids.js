import * as THREE from "three";

export class Asteroids {
    constructor({
        asteroidCount = 2000,
        orbitFarRadius = 140,
        orbitNearRadius = 70,
        axialRotationSpeed = 0,
        orbitRotationSpeed = 0, 
        thickness = 20,
        size = 1,
        color = 0x888888,
        roughness = 0.9,
        metalness = 0.1,
        parent =  null,
    } = {}) {
        this.axialRotationSpeed = axialRotationSpeed;
        this.orbitRotationSpeed = orbitRotationSpeed;

        // Orbit group (handles orbit around parent)
        this.orbitGroup = new THREE.Group();
        if (parent) {
            parent.add(this.orbitGroup);
        }

        // Actual asteroid meshes
        this.group = new THREE.Group();
        this.orbitGroup.add(this.group);

        const geometry = new THREE.IcosahedronGeometry(size, 0);
        const material = new THREE.MeshStandardMaterial({
            color,
            roughness,
            metalness,
        });
        this.mesh = new THREE.InstancedMesh(
            geometry, 
            material,
            asteroidCount,
        );
        this.mesh.count = asteroidCount;
        this.mesh.frustumCulled = false;
        // this.mesh.castShadow = true;
        // this.mesh.receiveShadow = true;

        const dummy = new THREE.Object3D();

        for (let i = 0; i < asteroidCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const r = orbitNearRadius + (orbitFarRadius - orbitNearRadius) * Math.cbrt(Math.random());

            dummy.position.set(
                Math.cos(angle) * r,
                (Math.random() - 0.5) * thickness,
                Math.sin(angle) * r
            );

            dummy.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );

            dummy.scale.setScalar(0.5 + Math.random());
            dummy.updateMatrix();

            this.mesh.setMatrixAt(i, dummy.matrix);
        }
        this.mesh.instanceMatrix.needsUpdate = true;
        this.group.add(this.mesh);
    }

    update(delta = 1) {
        // Rotate the entire belt around the parent
        this.orbitGroup.rotation.y += this.orbitRotationSpeed * delta;

        // Rotate each asteroid on its own axis
        const dummy = new THREE.Object3D();
        for (let i = 0; i < this.mesh.count; i++) {
            this.mesh.getMatrixAt(i, dummy.matrix);
            dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
            dummy.rotateY(this.axialRotationSpeed * delta);
            dummy.updateMatrix();
            this.mesh.setMatrixAt(i, dummy.matrix);
        }
        this.mesh.instanceMatrix.needsUpdate = true;
    }

    setPosition(x, y, z) {
        if (x instanceof THREE.Vector3) {
            this.group.position.copy(x);
        } else {
            this.group.position.set(x, y, z);
        }
    }
}