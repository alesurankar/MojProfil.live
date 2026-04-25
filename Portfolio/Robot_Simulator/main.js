import { Engine } from "./src/Engine.js";
import { UI } from "./ui.js";

const engine = new Engine({ fps: 40 });
engine.Start();

const ui = new UI(engine);