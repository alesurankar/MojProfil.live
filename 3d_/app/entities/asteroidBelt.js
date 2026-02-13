import * as THREE from "three";

export class AsteroidBelt 
{
  constructor({
    count = 3000,
    size = 1,
    orbitNearRadius = 1000,
    orbitFarRadius = 1300,
    thickness = 50,
    orbitalSpeed = 0.001,
    axialRotationSpeed = 0.001,
    detail = 0,
    parent = null,
    color = 0x888888
  } = {}) 
  {
    this.count = count;
    this.orbitalSpeed = orbitalSpeed;
    this.axialRotationSpeed = axialRotationSpeed;

    // Base geometry and material shared by all asteroids
    const geometry = new THREE.IcosahedronGeometry(size, detail);
    const material = new THREE.MeshStandardMaterial({ color });

    // Create the instanced body
    this.body = new THREE.InstancedMesh(geometry, material, count);
    this.body.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // allow updates

    // Store per-instance data
    this.instanceData = [];

    for (let i = 0; i < count; i++) {
      // Random position in a ring
      const radius = Math.random() * (orbitFarRadius - orbitNearRadius) + orbitNearRadius;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * thickness;

      const x = Math.cos(angle) * radius;
      const y = height;
      const z = Math.sin(angle) * radius;

      const position = new THREE.Vector3(x, y, z);

      // Random initial rotation
      const rotation = new THREE.Euler(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );

      // Random size variation
      const scale = 0.5 + Math.random() * 0.5;

      this.instanceData.push({ position, rotation, scale, radius, angle });
      
      // Set initial matrix
      const matrix = new THREE.Matrix4();
      matrix.compose(
        position,
        new THREE.Quaternion().setFromEuler(rotation),
        new THREE.Vector3(scale, scale, scale)
      );
      this.body.setMatrixAt(i, matrix);
    }

    if (parent) parent.add(this.body);
  }

  Update(dt) 
  {
    const tempMatrix = new THREE.Matrix4();
    for (let i = 0; i < this.count; i++) {
      const data = this.instanceData[i];

      // Update orbital angle
      data.angle -= this.orbitalSpeed * dt;
      const x = Math.cos(data.angle) * data.radius;
      const z = Math.sin(data.angle) * data.radius;
      const y = data.position.y;

      // Update rotation
      data.rotation.x += this.axialRotationSpeed * dt;
      data.rotation.y += this.axialRotationSpeed * dt;
      data.rotation.z += this.axialRotationSpeed * dt;

      // Compose new matrix
      tempMatrix.compose(
        new THREE.Vector3(x, y, z),
        new THREE.Quaternion().setFromEuler(data.rotation),
        new THREE.Vector3(data.scale, data.scale, data.scale)
      );
      this.body.setMatrixAt(i, tempMatrix);
    }
    this.body.instanceMatrix.needsUpdate = true;
  }

  Dispose() 
  {
    if (this.body) {
        this.body.geometry.dispose();
        this.body.material.dispose();
        if (this.body.parent) this.body.parent.remove(this.body);
        this.body = null;
    }
    this.instanceData = null;
  }
}
