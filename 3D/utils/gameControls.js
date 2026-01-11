import * as THREE from "three";
import { PointerLockControls } from "jsm/controls/PointerLockControls.js";

export class GameControls {
  constructor(camera, domElement = document.body, speed = 3.3) {
    this.camera = camera;
    this.speed = speed;

  // PointerLockControls for mouse-look
    this.controls = new PointerLockControls(camera, domElement);

    domElement.addEventListener("click", () => {
      this.controls.lock();
    });

    this.move = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      up: false,
      down: false,
      fast: false,
      slow: false
    };

    document.addEventListener("keydown", (e) => this._onKeyDown(e));
    document.addEventListener("keyup", (e) => this._onKeyUp(e));
  }

  _onKeyDown(event) {
    switch (event.code) {
      case "KeyW": this.move.forward = true; break;
      case "KeyS": this.move.backward = true; break;
      case "KeyA": this.move.left = true; break;
      case "KeyD": this.move.right = true; break;
      case "KeyV": this.move.fast = true; break;
      case "ShiftLeft": this.move.fast = true; break;
      case "Space": this.move.up = true; break;
    }
  }

  _onKeyUp(event) {
    switch (event.code) {
      case "KeyW": this.move.forward = false; break;
      case "KeyS": this.move.backward = false; break;
      case "KeyA": this.move.left = false; break;
      case "KeyD": this.move.right = false; break;
      case "KeyV": this.move.fast = false; break;
      case "ShiftLeft": this.move.fast = false; break;
      case "Space": this.move.up = false; break;
    }
  }

  update() {
    if (!this.controls.isLocked) return;

    const velocity = new THREE.Vector3();
    const direction = new THREE.Vector3();
    this.camera.getWorldDirection(direction);

    let speed = this.speed;
    if (this.move.fast) speed = 3;
    if (this.move.slow) speed = 0.3;

    // Forward / Back
    if (this.move.forward) velocity.add(direction.clone().multiplyScalar(speed));
    if (this.move.backward) velocity.add(direction.clone().multiplyScalar(-speed));

    // Left / Right
    const left = new THREE.Vector3().crossVectors(this.camera.up, direction).normalize();
    if (this.move.left) velocity.add(left.multiplyScalar(speed));
    if (this.move.right) velocity.add(left.multiplyScalar(-speed));

    // Up / Down
    if (this.move.up) velocity.y += speed;
    if (this.move.down) velocity.y -= speed;

    this.controls.getObject().position.add(velocity);
  }
}
