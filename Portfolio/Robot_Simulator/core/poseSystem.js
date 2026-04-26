import * as THREE from "three";

export class PoseSystem 
{
  constructor(robot) 
  {
    this.robot = robot;
    this.joints = {};
  }

  RegisterJoint(name, joint)
  {
    this.joints[name] = joint;
  }

  MapToJoint(joint, value)
  {
    const t = THREE.MathUtils.clamp((value - 50) / 50, -1, 1);

    return THREE.MathUtils.lerp(
      joint.minAngle,
      joint.maxAngle,
      (t + 1) / 2
    );
  }

  Update(dt, blackboard) 
  {
    // ---- KNEES ----
    const lk = blackboard.Get("leftKnee.stretch", 0);
    const rk = blackboard.Get("rightKnee.stretch", 0);

    const maxBend = Math.PI * 0.8;

    if (this.joints.leftKnee) {
      const t = lk / 100;
      this.joints.leftKnee.SetRotation(-t * maxBend);
    }

    if (this.joints.rightKnee) {
      const t = rk / 100;
      this.joints.rightKnee.SetRotation(-t * maxBend);
    }

    // ---- LEFT SHOULDER ----
    const lPitch = blackboard.Get("leftShoulder.pitch", 50);
    const lYaw   = blackboard.Get("leftShoulder.yaw", 50);
    const lRoll  = blackboard.Get("leftShoulder.roll", 50);

    if (this.joints["leftShoulder.pitch"]) {
      const joint = this.joints["leftShoulder.pitch"];
      joint.SetRotation(this.MapToJoint(joint, lPitch));
    }
    if (this.joints["leftShoulder.yaw"]) {
      const joint = this.joints["leftShoulder.yaw"];
      joint.SetRotation(this.MapToJoint(joint, lYaw));
    }
    if (this.joints["leftShoulder.roll"]) {
      const joint = this.joints["leftShoulder.roll"];
      joint.SetRotation(this.MapToJoint(joint, lRoll));
    }

    // ---- RIGHT SHOULDER ----
    const rPitch = blackboard.Get("rightShoulder.pitch", 50);
    const rYaw   = blackboard.Get("rightShoulder.yaw", 50);
    const rRoll  = blackboard.Get("rightShoulder.roll", 50);

    if (this.joints["rightShoulder.pitch"]) {
      const joint = this.joints["rightShoulder.pitch"];
      joint.SetRotation(this.MapToJoint(joint, rPitch));
    }
    if (this.joints["rightShoulder.yaw"]) {
      const joint = this.joints["rightShoulder.yaw"];
      joint.SetRotation(this.MapToJoint(joint, rYaw));
    }
    if (this.joints["rightShoulder.roll"]) {
      const joint = this.joints["rightShoulder.roll"];
      joint.SetRotation(this.MapToJoint(joint, rRoll));
    }
  }
}