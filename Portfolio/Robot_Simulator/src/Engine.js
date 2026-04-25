import { Scene, Update as SceneUpdate } from "./SceneSetup.js";
import { GameControls } from "../app/utils/gameControls.js";
import { DesktopInput } from "../app/input/desktopInput.js";
import { MobileInput } from "../app/input/mobileInput.js";
import { InputState } from "../app/input/inputState.js";
import { Camera, Renderer } from "./RendererSetup.js";


export class Engine 
{
  constructor({fps = 60} = {}) 
  {
    this.FIXED_FPS = fps;
    this.FIXED_DT = 1 / this.FIXED_FPS;
    this.lastTime = performance.now() / 1000;
    this.accumulator = 0;
    this.timeScale = 1;

    this.input = new InputState();
    const isTouch = "ontouchstart" in window;

    if (isTouch) {
      new MobileInput(this.input, document.body);
    } 
    else {
      new DesktopInput(this.input);
    }
    this.gameControls = new GameControls(Camera, this.input);
    this.MainLoop = this.MainLoop.bind(this);
  }

  MainLoop(now) 
  {
    now /= 1000;

    const frameTime = now - this.lastTime;
    this.lastTime = now;

    this.accumulator += frameTime;

    // Fixed-step updates
    while (this.accumulator >= this.FIXED_DT) {
      this.gameControls.Update();
      SceneUpdate(this.timeScale);
      this.accumulator -= this.FIXED_DT;
    }
    Renderer.render(Scene, Camera);
    requestAnimationFrame(this.MainLoop);
  }

  Start() 
  {
    requestAnimationFrame(this.MainLoop);
  }

  ToggleLock() 
  {
    this.gameControls.ToggleLock();
  }
}
