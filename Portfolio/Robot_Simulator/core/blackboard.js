export class Blackboard 
{
  constructor() 
  {
    // flat storage of all joint values
    this.values = new Map();
  }

  // SET value
  Set(path, value) 
  {
    this.values.set(path, value);
  }

  // GET value
  Get(path, defaultValue = 0) 
  {
    return this.values.has(path)
      ? this.values.get(path)
      : defaultValue;
  }

  // Register joint
  Register(path, defaultValue = 0) 
  {
    if (!this.values.has(path)) {
      this.values.set(path, defaultValue);
    }
  }

  // Debug helper
  Dump() 
  {
    console.log("Blackboard:");
    for (const [k, v] of this.values.entries()) {
      console.log(`${k} = ${v}`);
    }
  }

  // List all keys
  Keys() 
  {
    return Array.from(this.values.keys());
  }
}