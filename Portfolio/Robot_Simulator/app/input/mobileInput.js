export class MobileInput
{
  constructor(input, dom)
  {
    this.input = input;
    this.dom = dom;

    this.active = false;
    this.mode = "none"; // "move" | "look"

    this.lastX = 0;
    this.lastY = 0;

    dom.style.touchAction = "none";

    dom.addEventListener("touchstart", (e) => {
      e.preventDefault();

      const t = e.touches[0];

      this.lastX = t.clientX;
      this.lastY = t.clientY;

      this.active = true;

      // decide mode ONCE
      this.mode = (t.clientX < window.innerWidth * 0.5)
        ? "move"
        : "look";

    }, { passive: false });

    dom.addEventListener("touchmove", (e) => {
      e.preventDefault();
      if (!this.active) return;

      const t = e.touches[0];

      const dx = t.clientX - this.lastX;
      const dy = t.clientY - this.lastY;

      this.lastX = t.clientX;
      this.lastY = t.clientY;

      if (this.mode === "move")
      {
        const threshold = 5;

        this.input.move.forward  = dy < -threshold;
        this.input.move.backward = dy > threshold;
        this.input.move.left     = dx < -threshold;
        this.input.move.right    = dx > threshold;
      }
      else if (this.mode === "look")
      {
        this.input.lookDelta.x = dx * 0.002;
        this.input.lookDelta.y = dy * 0.002;
      }

    }, { passive: false });

    dom.addEventListener("touchend", () => {
      this.active = false;
      this.mode = "none";

      this.input.move.forward = false;
      this.input.move.backward = false;
      this.input.move.left = false;
      this.input.move.right = false;

      this.input.lookDelta.x = 0;
      this.input.lookDelta.y = 0;
    });
  }
}