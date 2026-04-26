export class UI
{
  constructor(engine) 
  {
    this.engine = engine;
    this.root = document.createElement("div");
    this.root.style.position = "absolute";
    this.root.style.top = "10px";
    this.root.style.left = "10px";
    this.root.style.color = "white";
    document.body.appendChild(this.root);
    this.Build();
  }

  Build()
  {
    const isTouch = navigator.maxTouchPoints > 0;

    if (!isTouch) {
      this.AddButton("Lock", () => {
        this.engine.ToggleLock();
      });
    }
    this.AddSlider("Rotate Speed", 0, 5, 0, (v) => {
      this.engine.blackboard.Set("locomotion.rotateSpeed", v);
    });
    this.AddSlider("Move Speed", 0, 10, 0, (v) => {
      this.engine.blackboard.Set("locomotion.moveSpeed", v);
    });
    this.AddSlider("LeftKnee", 0, 100, 0, (v) => {
      this.engine.blackboard.Set("leftKnee.stretch", v);
    });
    this.AddSlider("RightKnee", 0, 100, 0, (v) => {
      this.engine.blackboard.Set("rightKnee.stretch", v);
    });
    // Left Shoulder
    this.AddSlider("Left Shoulder Pitch", 0, 100, 50, (v) => {
      this.engine.blackboard.Set("leftShoulder.pitch", v);
    });
    this.AddSlider("Left Shoulder Yaw", 0, 100, 50, (v) => {
      this.engine.blackboard.Set("leftShoulder.yaw", v);
    });
    this.AddSlider("Left Shoulder Roll", 0, 100, 50, (v) => {
      this.engine.blackboard.Set("leftShoulder.roll", v);
    });
    // Right Shoulder
    this.AddSlider("Right Shoulder Pitch", 0, 100, 50, (v) => {
      this.engine.blackboard.Set("rightShoulder.pitch", v);
    });
    this.AddSlider("Right Shoulder Yaw", 0, 100, 50, (v) => {
      this.engine.blackboard.Set("rightShoulder.yaw", v);
    });
    this.AddSlider("Right Shoulder Roll", 0, 100, 50, (v) => {
      this.engine.blackboard.Set("rightShoulder.roll", v);
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