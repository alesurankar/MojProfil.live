export class DesktopInput
{
  constructor(input)
  {
    this.input = input;

    window.addEventListener("keydown", (e) => this.down(e));
    window.addEventListener("keyup", (e) => this.up(e));
  }

  down(e)
  {
    switch (e.code)
    {
      case "KeyW": this.input.move.forward = true; break;
      case "KeyS": this.input.move.backward = true; break;
      case "KeyA": this.input.move.left = true; break;
      case "KeyD": this.input.move.right = true; break;
      case "Space": this.input.move.up = true; break;
      case "KeyV": this.input.move.down = true; break;
      case "ShiftLeft": this.input.move.fast = true; break;
    }
  }

  up(e)
  {
    switch (e.code)
    {
      case "KeyW": this.input.move.forward = false; break;
      case "KeyS": this.input.move.backward = false; break;
      case "KeyA": this.input.move.left = false; break;
      case "KeyD": this.input.move.right = false; break;
      case "Space": this.input.move.up = false; break;
      case "KeyV": this.input.move.down = false; break;
      case "ShiftLeft": this.input.move.fast = false; break;
    }
  }
}