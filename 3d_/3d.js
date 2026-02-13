import { Engine } from "./src/Engine.js";


const engine = new Engine({fps: 40});
engine.Start();



window.enableGameMode = () => engine.EnableGameMode();
window.enableSimulation = () => engine.EnableSimulation();

window.bind3DUI = function () 
{
  const lockIn = document.getElementById("lockIn");
  const timeScale = document.getElementById("timeScale");

  if (lockIn) {
    lockIn.onclick = () => {
      engine.ToggleLock();
    };

    engine.gameControls.onLock = () => {
      lockIn.textContent = "🔓 Lock Out";
    };

    engine.gameControls.onUnlock = () => {
      lockIn.textContent = "🔒 Lock In";
    };
  }

  if (timeScale) {
    timeScale.oninput = (e) => {
      engine.SetTimeScale(Number(e.target.value));
    };
  }
};