export class StarSystem
{
    timeFactor = 1
    static get Sclae() {
        return this.timeFactor;  // now it’s always recalculated
    }
    static OrbitalRotationInDays(days, scale = StarSystem.Sclae) 
    {
        const seconds = days * 24 * 60 * 60;
        return (2 * Math.PI / seconds) * scale;
    }
    static AxialRotationInDays(days, scale = StarSystem.Sclae) 
    {
        const seconds = days * 24 * 60 * 60;
        return (2 * Math.PI / seconds) * scale;
    }
}