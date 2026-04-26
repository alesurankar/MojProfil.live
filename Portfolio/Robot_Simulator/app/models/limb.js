import * as THREE from "three";
import { Link } from "../models/link.js";
import { Joint } from "../models/joint.js";

export class Limb
{
  constructor(
  {
    structure = [{ length: 5 }, { length: 5 }],
    parent = null,
    axis = new THREE.Vector3(0, 0, 1),
    position = new THREE.Vector3(),
    rotation = new THREE.Euler(),
  } = {}) 
  {
    this.root = new THREE.Group();
    this.root.position.copy(position);
    this.root.rotation.copy(rotation);
    parent?.add(this.root);

    this.joints = [];
    this.links = [];

    let currentParent = this.root;

    for (let i = 0; i < structure.length; i++) {
      const segment = structure[i];

      // JOINT
      const joint = new Joint({
        parent: currentParent,
        axis: segment.axis ?? axis,
        restRotation: segment.restRotation ?? new THREE.Euler(),
        minAngle: segment.min ?? -Math.PI,
        maxAngle: segment.max ?? Math.PI
      });
      this.joints.push(joint);

      // LINK
      const link = new Link({
        length: segment.length,
        thickness: segment.thickness ?? 0.5,
        color: segment.color ?? 0xC9B903,
        shape: segment.shape,
        parent: joint.pivot
      });
      this.links.push(link);
      
      joint.pivot.position.y = (i === 0) ? 0 : structure[i - 1].length;
      currentParent = link.objectRoot;
    }
  }

  Update(dt, fn)
  {
    const t = performance.now() * 0.001;

    for (let i = 0; i < this.joints.length; i++) {
      const angle = fn
        ? fn(i, t)
        : 0;

      this.joints[i].SetRotation(angle);
    }
  }

  Dispose()
  {
    this.links.forEach(l => l?.Dispose());
    this.joints.forEach(j => j?.Dispose());

    this.root.removeFromParent();
  }
}