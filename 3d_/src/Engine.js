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
        
        this._running = false;
        this._rafId = null;
        
        this.MainLoop = this.MainLoop.bind(this);
    }

    MainLoop(now) 
    {
        if (!this._running) return;

        now /= 1000;

        const frameTime = now - this.lastTime;
        this.lastTime = now;

        this.accumulator += frameTime;

        while (this.accumulator >= this.FIXED_DT) {
            this.gameControls.Update();
            SceneUpdate(this.timeScale);
            this.accumulator -= this.FIXED_DT;
        }

        // Render
        Renderer.render(Scene, Camera);
        this._rafId = requestAnimationFrame(this.MainLoop);
    }

    Start() 
    {
        if (this._running) return;
        this._running = true;
        this.lastTime = performance.now() / 1000;
        this._rafId = requestAnimationFrame(this.MainLoop);
    }

    Stop() 
    {
        this._running = false;
        if (this._rafId !== null) {
            cancelAnimationFrame(this._rafId);
            this._rafId = null;
        }
    }

    EnableGameMode() 
    {
        this.gameControls.enabled = true;
    }

    EnableSimulation() 
    {
        this.gameControls.enabled = false;
    }

    ToggleLock() 
    {
        this.gameControls.ToggleLock();
    }

    SetTimeScale(scale) {
        this.timeScale = Math.max(0, scale);
    }
}
