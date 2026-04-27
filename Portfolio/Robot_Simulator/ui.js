import { Moves } from "./app/moves/moves.js";

export class UI
{
  constructor(engine) 
  {
    this.engine = engine;
    this.root = document.createElement("div");
    this.root.id = "ui";
    document.body.appendChild(this.root);
    this.Build();
  }

  Build()
  {
    this.AddButton("Wave", () => {
      this.engine.PlayMove(Moves.wave, 1.0);
    });

    this.AddButton("Punch", () => {
      this.engine.PlayMove(Moves.punch, 1.0);
    });

    this.AddButton("Idle", () => {
      this.engine.PlayMove(Moves.idle, 0.5);
    });

    

    const isTouch = navigator.maxTouchPoints > 0;

    if (!isTouch) {
      this.AddButton("Lock", () => {
        this.engine.ToggleLock();
      });
    }
    const locomotionControls = [
      { label: "Rotate Speed", key: "locomotion.rotateSpeed", min: 0, max: 5, default: 0 },
      { label: "Move Speed", key: "locomotion.moveSpeed", min: 0, max: 10, default: 0 },
    ];
    locomotionControls.forEach(c => {
      this.AddSlider(c.label, c.min, c.max, c.default, v => {
        this.engine.blackboard.Set(c.key, v);
      });
    });

    const poseControls  = [
      // Legs
      { label: "Left Knee", key: "leftKnee.stretch", min: 8, max: 50, default: 50 },
      { label: "Right Knee", key: "rightKnee.stretch", min: 8, max: 50, default: 50 },

      // Arms
      { label: "Left Shoulder Horizontal", key: "leftShoulder.horizontal", min: 10, max: 90, default: 50 },
      { label: "Left Shoulder Vertical", key: "leftShoulder.vertical", min: 10, max: 90, default: 50 },
      { label: "Left Shoulder Roll", key: "leftShoulder.roll", min: 10, max: 90, default: 50 },
      { label: "Left Elbow", key: "leftElbow.stretch", min: 50, max: 90, default: 50 },
      { label: "Left Wrist Roll", key: "leftWrist.roll", min: 0, max: 55, default: 50 },
      { label: "Left Wrist", key: "leftWrist.stretch", min: 35, max: 80, default: 50 },

      { label: "Right Shoulder Horizontal", key: "rightShoulder.horizontal", min: 10, max: 90, default: 50 },
      { label: "Right Shoulder Vertical", key: "rightShoulder.vertical", min: 10, max: 90, default: 50 },
      { label: "Right Shoulder Roll", key: "rightShoulder.roll", min: 10, max: 90, default: 50 },
      { label: "Right Elbow", key: "rightElbow.stretch", min: 50, max: 90, default: 50 },
      { label: "Right Wrist Roll", key: "rightWrist.roll", min: 0, max: 55, default: 50 },
      { label: "Right Wrist", key: "rightWrist.stretch", min: 35, max: 80, default: 50 },
    ];
    poseControls.forEach(c => {
      this.AddSlider(c.label, c.min, c.max, c.default, v => {
        this.engine.blackboard.Set(c.key, v);
      });
    });
  }

  AddButton(label, onClick) 
  {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.onclick = onClick;
    this.root.appendChild(btn);
    return btn;
  }

  AddSlider(label, min, max, value, onInput) 
  {
    const container = document.createElement("div");

    const text = document.createElement("div");
    text.textContent = `${label}: ${value}`;

    const input = document.createElement("input");
    input.type = "range";
    input.min = min;
    input.max = max;
    input.value = value;

    input.oninput = (e) => {
      const v = Number(e.target.value);
      text.textContent = `${label}: ${v}`;
      onInput(v);
    };

    container.appendChild(text);
    container.appendChild(input);
    this.root.appendChild(container);

    return input;
  }
}