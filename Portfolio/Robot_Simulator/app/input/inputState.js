export class InputState
{
  constructor()
  {
    this.move = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      up: false,
      down: false,
      fast: false
    };

    this.lookDelta = { x: 0, y: 0 };
  }

  ResetFrame()
  {
    this.lookDelta.x = 0;
    this.lookDelta.y = 0;
  }
}