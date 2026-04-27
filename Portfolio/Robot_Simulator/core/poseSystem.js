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
    const limbs = [
      // legs 
      ["leftKnee.stretch", "leftKnee.stretch"],
      ["rightKnee.stretch", "rightKnee.stretch"],
      // Arms
      ["leftShoulder.horizontal", "leftShoulder.horizontal"],
      ["leftShoulder.vertical", "leftShoulder.vertical"],
      ["leftShoulder.roll", "leftShoulder.roll"],
      ["leftElbow.stretch", "leftElbow.stretch"],
      ["leftWrist.roll", "leftWrist.roll"],
      ["leftWrist.stretch", "leftWrist.stretch"],

      ["rightShoulder.horizontal", "rightShoulder.horizontal"],
      ["rightShoulder.vertical", "rightShoulder.vertical"],
      ["rightShoulder.roll", "rightShoulder.roll"],
      ["rightElbow.stretch", "rightElbow.stretch"],
      ["rightWrist.roll", "rightWrist.roll"],
      ["rightWrist.stretch", "rightWrist.stretch"],
    ];

    for (const [key, jointName] of limbs) {
      const value = blackboard.Get(key, 50);
      const joint = this.joints[jointName];
      if (!joint) continue;
      joint.SetRotation(this.MapToJoint(joint, value));
    }
  }
}