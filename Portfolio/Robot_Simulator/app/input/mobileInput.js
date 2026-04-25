export class MobileInput
{
  constructor(input, dom)
  {
    this.input = input;
    this.dom = dom;

    this.startX = 0;
    this.startY = 0;
    this.active = false;

    dom.addEventListener("touchstart", (e) => {
      const t = e.touches[0];
      this.startX = t.clientX;
      this.startY = t.clientY;
      this.active = true;
    });

    dom.addEventListener("touchmove", (e) => {
      if (!this.active) return;

      const t = e.touches[0];

      const dx = t.clientX - this.startX;
      const dy = t.clientY - this.startY;

      // look (camera rotation)
      this.input.lookDelta.x = dx * 0.002;
      this.input.lookDelta.y = dy * 0.002;

      // movement (still simple digital for now)
      this.input.move.forward = dy < -10;
      this.input.move.backward = dy > 10;
      this.input.move.left = dx < -10;
      this.input.move.right = dx > 10;
    });

    dom.addEventListener("touchend", () => {
      this.active = false;

      this.input.move.forward = false;
      this.input.move.backward = false;
      this.input.move.left = false;
      this.input.move.right = false;

      this.input.lookDelta.x = 0;
      this.input.lookDelta.y = 0;
    });
  }
}