import * as THREE from "three";

export class Link
{
  constructor(
  {
    length = 5,
    width = 0.5,
    depth = 0.5,
    color = 0xC9B903,
    shape = null,
    parent = null,
  } = {}) 
  {
    this.length = length;
    let radius = 0;

    let geom 
    if (shape === "sphere") {
      radius = Math.max(width, depth) * 0.5;
      geom = new THREE.SphereGeometry(radius, 16, 16);
      const pos = geom.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        let x = pos.getX(i);
        let y = pos.getY(i);
        let z = pos.getZ(i);
        
        // stretch top
        if (y > 0) {
          y *= 1.2;
        }
        // flatten bottom
        if (y < -0.5) {
          y *= 0.8;
        }
        // slight horizontal squash
        y *= 1.15;
        z *= 1.15;
        // lower-back dent
        if (y < 0.5 && z < 0) {
          const strength = (Math.abs(y) * z) * 0.4;
          z -= strength;   // push inward
        }
        pos.setXYZ(i, x, y, z);
      }

      pos.needsUpdate = true;
      geom.computeVertexNormals();
    }
    else if (shape === "cylinder") {

      const radiusTop = width * 0.5;
      const radiusBottom = depth * 0.5;

      geom = new THREE.CylinderGeometry(
        radiusTop,
        radiusBottom,
        length,
        16
      );
    }
    else {
      geom = new THREE.BoxGeometry(width, length, depth);
    }

    const mat = new THREE.MeshStandardMaterial({ color });
    this.objectRoot = new THREE.Group();
    this.body = new THREE.Mesh(geom, mat);
    this.body.castShadow = true;
    this.body.receiveShadow = true;

    // anchor at bottom of the link
    if (shape === "sphere") {
      this.body.position.y = radius;
    } 
    else {
      this.body.position.y = length / 2;
    }

    this.objectRoot.add(this.body);
    parent?.add(this.objectRoot);
  }

  Dispose() 
  {
    this.body.geometry.dispose();
    this.body.material.dispose();
    this.body = null;
    this.objectRoot = null;
  }
}