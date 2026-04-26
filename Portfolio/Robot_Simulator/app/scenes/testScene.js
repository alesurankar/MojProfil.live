import * as THREE from "three";
import { BaseScene } from "./baseScene.js"
import { Robot } from "../models/robot.js";
import { Locomotion } from "../../core/locomotion.js";
import { PoseSystem } from "../../core/poseSystem.js";


export class TestScene extends BaseScene
{
  constructor(scene) 
  {  
    super(scene);
    this.cameraSettings = {
      pos: { x: -50, y: 20, z: 50 },
      lookAt: { x: 0, y: 10, z: 0 },
      fov: 40
    };
    this.locomotion = null;
    this.poseSystem = null;
    this.robot = null;
  }

  CreateObjects()
  { 
    this.robot = new Robot();
    this.scene.add(this.robot.root);
    this.objects.push(this.robot);

    this.locomotion = new Locomotion(this.robot);
    this.poseSystem = new PoseSystem(this.robot);
    this.poseSystem.RegisterJoint("leftKnee", this.robot.leftLeg.joints[1]);
    this.poseSystem.RegisterJoint("rightKnee", this.robot.rightLeg.joints[1]);
    
    // Shoulders
    this.poseSystem.RegisterJoint("leftShoulder.pitch", this.robot.leftArm.joints[0]);
    this.poseSystem.RegisterJoint("leftShoulder.yaw",   this.robot.leftArm.joints[1]);
    this.poseSystem.RegisterJoint("leftShoulder.roll",  this.robot.leftArm.joints[2]);

    this.poseSystem.RegisterJoint("rightShoulder.pitch", this.robot.rightArm.joints[0]);
    this.poseSystem.RegisterJoint("rightShoulder.yaw",   this.robot.rightArm.joints[1]);
    this.poseSystem.RegisterJoint("rightShoulder.roll",  this.robot.rightArm.joints[2]);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100),
      new THREE.MeshStandardMaterial({ color: 0x444444 })
    );

    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    ground.receiveShadow = true;

    this.scene.add(ground);
  }

  Update(dt, blackboard) 
  {
    super.Update(dt, blackboard);
    this.locomotion.Update(dt, blackboard);
    this.poseSystem.Update(dt, blackboard);
  }
}