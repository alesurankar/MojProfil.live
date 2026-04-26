export class Locomotion 
{
  constructor(robot) 
  {
    this.robot = robot;
  }

  Update(dt, joints) 
  {
    const moveSpeed = joints.Get("locomotion.moveSpeed", 0);
    const turnSpeed = joints.Get("locomotion.rotateSpeed", 0);

    this.robot.RotateY(turnSpeed * dt);
    this.robot.MoveLocal(0, 0, moveSpeed * dt);
  }
}