import * as THREE from "three";

export class Star {
  constructor({
    // default for sun
    name = "sun",
    size = 20,
    axialRotationSpeed = 0,
    position = new THREE.Vector3(10, 10, 50),
    temperature = 5778,
    detail = 4,
    texturesPath = "./3D/textures",
  } = {}) {
    this.loader = new THREE.TextureLoader();

    // group
    this.group = new THREE.Group();
    this.group.position.copy(position);

    const scaleFactor = 0.00000000000001; 
    const luminosity = 4 * Math.PI * Math.pow(size, 2) * Math.pow(temperature, 4);
    const intensity = luminosity * scaleFactor;

    const distance = Math.pow(size, 3);
    const starColor = this.colorFromTemperature(temperature);

    // geometry
    const geometry = new THREE.IcosahedronGeometry(size, detail);

    // material
    const material = new THREE.MeshBasicMaterial({
        map: this.loader.load(`${texturesPath}/${name}/${name}.jpg`),
        color: starColor,
    });
    this.star = new THREE.Mesh(geometry, material);
    this.star.castShadow = false;
    this.star.receiveShadow = false;
    this.group.add(this.star);

    // point light
    this.light1 = new THREE.PointLight(starColor, intensity, distance);
    this.light2 = new THREE.PointLight(starColor, intensity, distance);
    this.light3 = new THREE.PointLight(starColor, intensity, distance);
    this.light4 = new THREE.PointLight(starColor, intensity, distance);
    this.light5 = new THREE.PointLight(starColor, intensity, distance);
    this.light6 = new THREE.PointLight(starColor, intensity, distance);
    //this.light.castShadow = true;
    //this.light.shadow.mapSize.set(2048, 2048);
    //this.light.shadow.camera.near = 0.1;
    //this.light.shadow.camera.far = distance === 0 ? 5000 : distance;
    const lightPos = 3*size/2;
    this.light1.position.set(lightPos, 0, 0);
    this.light2.position.set(0, lightPos, 0);
    this.light3.position.set(0, 0, lightPos);
    this.light4.position.set(-lightPos, 0, 0);
    this.light5.position.set(0, -lightPos, 0);
    this.light6.position.set(0, 0, -lightPos);
    this.group.add(this.light1);
    this.group.add(this.light2);
    this.group.add(this.light3);
    this.group.add(this.light4);
    this.group.add(this.light5);
    this.group.add(this.light6);
  }

  colorFromTemperature(T) {
    let r = 0;
    let g = 0;
    let b = 0;

    // --- Red ---
    if (T <= 1200) {
      r = (T / 1200) * 255;
    } 
    else if (T <= 10000) {
      r = 255;
    } 
    else {
      let fadeStart = 20000;
      let fadeEnd = 40000;
      r = 255 - ((T - fadeStart) / (fadeEnd - fadeStart)) * (255 - 180);
      if (r < 60) r = 60;
    }

    // // --- Green ---
    if (T <= 5000) {
      g = (T / 5000) * 255;
    } 
    else if (T <= 12000) {
      g = 255;
    }
    else {
      let fadeStart = 12000;
      let fadeEnd = 24000;
      g = 255 - ((T - fadeStart) / (fadeEnd - fadeStart)) * 255;
      if (g < 120) g = 120;
    }

    // // --- Blue ---
    if (T <= 7000) {
      b = (T / 7000) * 255;
    }
    else {
      b = 255;
    }

    return new THREE.Color(r / 255, g / 255, b / 255);
  }


    setPosition(x, y, z) {
        if (x instanceof THREE.Vector3) {
            this.group.position.copy(x);
        } else {
            this.group.position.set(x, y, z);
        }
    }
}