import * as THREE from "three";

export class Joint
{
  constructor(
  { 
    parent = null,
    axis = new THREE.Vector3(0, 0, 1),
    restRotation = new THREE.Euler(),
    minAngle = -Math.PI,
    maxAngle = Math.PI,
  } = {}) 
  {
    this.axis = axis;
    this.restRotation = restRotation;
    this.minAngle = minAngle;
    this.maxAngle = maxAngle;

    this.angle = 0;
    this.pivot = new THREE.Group();

    this.body = new THREE.Mesh(
      new THREE.SphereGeometry(0.55, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xff0000 })
    );
    this.body.castShadow = true;
    this.body.receiveShadow = true;

    this.pivot.add(this.body);
    parent?.add(this.pivot);
    this.ApplyRotation();
  }

  ApplyRotation() 
  {
    const restQuat = new THREE.Quaternion().setFromEuler(this.restRotation);
    const worldAxis = this.axis.clone();

    const animQuat = new THREE.Quaternion().setFromAxisAngle(
      worldAxis,
      this.angle
    );
    this.pivot.quaternion.copy(restQuat).multiply(animQuat);
  }

  SetRotation(angle) 
  {
    this.angle = THREE.MathUtils.clamp(
      angle,
      this.minAngle,
      this.maxAngle
    );
    this.ApplyRotation();
  }

  Dispose() 
  {
    this.pivot.traverse(obj => {
      if (obj.isMesh) {
        obj.geometry?.dispose();
        obj.material?.dispose();
      }
    });

    this.pivot = null;
  }
}