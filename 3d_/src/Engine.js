import { Scene, Update as SceneUpdate } from "./SceneSetup.js";
import { GameControls } from "../app/utils/gameControls.js"
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

        this.gameControls = new GameControls(Camera, document.body);
        this.mode = "simulation";
        this.MainLoop = this.MainLoop.bind(this);
    }

    MainLoop(now) 
    {
        now /= 1000;

        const frameTime = now - this.lastTime;
        this.lastTime = now;

        this.accumulator += frameTime;

        while (this.accumulator >= this.FIXED_DT) {
            if (this.mode === "game") this.gameControls.Update();
            SceneUpdate(this.timeScale, this.mode);
            this.accumulator -= this.FIXED_DT;
        }

        Renderer.render(Scene, Camera);
        requestAnimationFrame(this.MainLoop);
    }

    Start() 
    {
        requestAnimationFrame(this.MainLoop);
    }

    EnableGameMode() 
    {
        this.gameControls.enabled = true;
        this.mode = "game";
    }

    EnableSimulation() 
    {
        this.gameControls.enabled = false;
        this.mode = "simulation";
    }

    ToggleLock() 
    {
        this.gameControls.ToggleLock();
    }

    SetTimeScale(scale) {
        this.timeScale = Math.max(0, scale);
    }
}
