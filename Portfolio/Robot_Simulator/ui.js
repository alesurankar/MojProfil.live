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
    this.AddButton("Lock", () => {
      this.engine.ToggleLock();
    });
    this.AddSlider("testSlider", 1, 10, 3, (v) => {
      console.log("slider value:", v);
    });
    this.AddSlider("testSlider", 1, 10, 3, (v) => {
      console.log("slider value:", v);
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