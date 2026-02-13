import * as THREE from "three";
import { CelestialBody } from "./celestialBody.js";


export class Star extends CelestialBody 
{
    constructor({
        name = "star",
        size = 20,
        maxSizeOnScreen = 1,
        renderMode = "mesh",
        lightType = "none",
        targetObject = null,
        posToParent = new THREE.Vector3(0, 0, 0),
        axialTilt = 0,
        orbitalTilt = 0,
        axialRotationSpeed = 0,
        orbitalSpeed = 0,
        detail = 3,
        temperature = 6000,
        sizeAtenuation = true,
        hasTexture = false,
        parent = null,
    } = {}) 
    {
        // Prepare texture and material
        let surfMat = null;
        let geometry = null;
        const starColor = Star.#ColorFromTemperature(temperature);
        const loader = new THREE.TextureLoader();

        if (renderMode === "points") {
            const maxSize = maxSizeOnScreen * 100;
            const spriteSize = THREE.MathUtils.clamp(size * maxSize, 2, maxSize);
            const surfTexture = "./3d_/app/textures/star.png";
            const surfTex = loader.load(surfTexture);
            surfMat = new THREE.PointsMaterial({ 
                size: spriteSize,
                map: surfTex, 
                vertexColors: true, 
                transparent: true,
                sizeAttenuation: sizeAtenuation,
            });
            
            geometry = new THREE.BufferGeometry();
            geometry.setAttribute("position",new THREE.Float32BufferAttribute([0, 0, 0], 3));
            geometry.setAttribute("color", new THREE.Float32BufferAttribute([starColor.r, starColor.g, starColor.b], 3));
        }
        else {
            if (hasTexture) {
                const surfTexture = `./3d_/app/textures/${name}/${name}.jpg`;
                const surfTex = loader.load(surfTexture);
                surfMat = new THREE.MeshBasicMaterial({ map: surfTex, color: starColor });
            }
            else {
                surfMat = new THREE.MeshBasicMaterial({ color: starColor });
            }
            // Create geometry
            geometry = new THREE.IcosahedronGeometry(size, detail);
        }

        // Call base constructor
        super({
            size,
            renderMode,
            posToParent,
            axialTilt,
            orbitalTilt,
            axialRotationSpeed,
            orbitalSpeed,
            surfMat,
            geometry,
            parent,
        });

        if (lightType === "pointLight") {
            this.light = new THREE.Group();

            // Light parameters
            const scaleFactor = 0.00000000000001; 
            const luminosity = 4 * Math.PI * Math.pow(size, 2) * Math.pow(temperature, 4);
            const intensity = luminosity * scaleFactor;
            const distance = Math.pow(size, 3);

            // Creating lights
            this.light1 = new THREE.PointLight(starColor, intensity, distance);
            this.light2 = new THREE.PointLight(starColor, intensity, distance);
            this.light3 = new THREE.PointLight(starColor, intensity, distance);
            this.light4 = new THREE.PointLight(starColor, intensity, distance);
            this.light5 = new THREE.PointLight(starColor, intensity, distance);
            this.light6 = new THREE.PointLight(starColor, intensity, distance);

            // Setting light positions
            const lightPos = 3*size/2;
            this.light1.position.set(lightPos, 0, 0);
            this.light2.position.set(0, lightPos, 0);
            this.light3.position.set(0, 0, lightPos);
            this.light4.position.set(-lightPos, 0, 0);
            this.light5.position.set(0, -lightPos, 0);
            this.light6.position.set(0, 0, -lightPos);

            // Adding light to hierarchy
            this.objectRoot.add(this.light);
            this.light.add(this.light1);
            this.light.add(this.light2);
            this.light.add(this.light3);
            this.light.add(this.light4);
            this.light.add(this.light5);
            this.light.add(this.light6);
        }
        else if (lightType === "directionalLight") {
            const intensity = maxSizeOnScreen * 10; // scale with star size
            this.light = new THREE.DirectionalLight(starColor, intensity);

            // Place the light at the star's position
            this.light.position.copy(posToParent);

            // Set target: if none provided, default to origin
            const target = targetObject || new THREE.Object3D();
            if (!target.parent) this.objectRoot.add(target); // make sure it's in scene graph
            this.light.target = target;

            this.objectRoot.add(this.light);
        }
    }

    static #ColorFromTemperature(T) {
        let r = 0, g = 0, b = 0;
        // --- Red ---
        if (T <= 1200) r = (T / 1200) * 255;
        else if (T <= 10000) r = 255;
        else {
            let fadeStart = 10000;
            let fadeEnd = 20000;
            r = 255 - ((T - fadeStart) / (fadeEnd - fadeStart)) * (255 - 180);
            if (r < 80) r = 80;
        }

        // // --- Green ---
        if (T <= 5000) g = (T / 5000) * 255;
        else  g = 255;

        // // --- Blue ---
        if (T <= 7000) b = (T / 7000) * 255;
        else b = 255;

        return new THREE.Color(r / 255, g / 255, b / 255);
    }

    Dispose() 
    {
        if (this.light) {
            this.light.clear();
            this.objectRoot.remove(this.light);
            this.light = null;
        }
        super.Dispose();
    }
}