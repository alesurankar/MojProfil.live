import * as THREE from "three";
import { PointerLockControls } from "jsm/controls/PointerLockControls.js";

export class GameControls 
{
  constructor(camera, input) 
  {
    this.camera = camera;
    this.input = input;

    this.controls = new PointerLockControls(camera, document.body);

    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();
    this.left = new THREE.Vector3();

    this.onLock = null;
    this.onUnlock = null;

    this.controls.addEventListener("lock", () => {
      document.activeElement?.blur();
      this.onLock?.();
    });

    this.controls.addEventListener("unlock", () => {
      document.activeElement?.blur();
      this.onUnlock?.();
    });
  }

  Lock() 
  {
    this.controls.lock();
  }

  Unlock() 
  {
    this.controls.unlock();
  }

  ToggleLock() 
  {
    if (this.controls.isLocked) {
      this.controls.unlock();
    } 
    else {
      this.controls.lock();
    }
  }

  Update()
  {
    const move = this.input.move;
    if (!this.controls.isLocked || !move) return;

    this.velocity.set(0, 0, 0);

    this.camera.getWorldDirection(this.direction);

    const speed = move.fast ? 2 : 0.5;

    if (move.forward)
      this.velocity.add(this.direction.clone().multiplyScalar(speed));

    if (move.backward)
      this.velocity.add(this.direction.clone().multiplyScalar(-speed));

    this.left.crossVectors(this.camera.up, this.direction).normalize();

    if (move.left)
      this.velocity.add(this.left.clone().multiplyScalar(speed));

    if (move.right)
      this.velocity.add(this.left.clone().multiplyScalar(-speed));

    if (move.up) this.velocity.y += speed;
    if (move.down) this.velocity.y -= speed;

    this.controls.getObject().position.add(this.velocity);
  }
}