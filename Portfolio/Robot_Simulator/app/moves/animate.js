export class Animator
{
  constructor()
  {
    this.pending = null;
    this.active = null;
  }

  Play(targetPose, duration)
  {
    this.pending = { targetPose, duration };
  }

  Update(dt, blackboard)
  {
    // start animation
    if (this.pending) {

      const startPose = {};
      for (const key of Object.keys(this.pending.targetPose)) {
        startPose[key] = blackboard.Get(key, 50);
      }

      this.active = {
        start: startPose,
        target: this.pending.targetPose,
        time: 0,
        duration: this.pending.duration
      };

      this.pending = null;
    }

    if (!this.active) return;

    const a = this.active;
    a.time += dt;

    const t = Math.min(a.time / a.duration, 1);
    const k = t * t * (3 - 2 * t);

    for (const key in a.target) {
      const start = a.start[key];
      const end = a.target[key];
      blackboard.Set(key, start + (end - start) * k);
    }

    if (t >= 1) this.active = null;
  }
}