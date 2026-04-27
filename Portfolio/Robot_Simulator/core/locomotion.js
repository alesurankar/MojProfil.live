export class Locomotion 
{
  constructor(robot) 
  {
    this.robot = robot;
  }

  Update(dt, blackboard) 
  {
    const moveSpeed = Math.min(blackboard.Get("locomotion.moveSpeed", 0), 10);
    const turnSpeed = Math.min(blackboard.Get("locomotion.rotateSpeed", 0), 5);

    this.robot.RotateY(turnSpeed * dt);
    this.robot.MoveLocal(0, 0, moveSpeed * dt);
  }
}