import * as THREE from "three";

export class Planet {
    constructor({
        name = "earth",
        size = 10,
        axialTilt = 0,
        axialRotationSpeed = 0,
        cloudRotationSpeed = 0,
        orbitRadius = 0,
        orbitRotationSpeed = 0, 
        texturesPath = "./3D/textures",
        dayTexture = "day.jpg",
        nightTexture = "night.jpg",
        cloudTexture = "clouds.jpg",
        nightOpacity = 0,
        cloudOpacity = 0,
        parent = null, 
    } = {}) {
        this.loader = new THREE.TextureLoader();
        this.axialRotationSpeed = axialRotationSpeed;
        this.cloudRotationSpeed = cloudRotationSpeed;
        this.axialTilt = axialTilt * Math.PI / 180;
        this.orbitRotationSpeed = orbitRotationSpeed;
        this.orbitRadius = orbitRadius;

        // Create the main group for this planet
        this.group = new THREE.Group();

        // Orbit group (handles orbit around parent)
        this.orbitGroup = new THREE.Group();
        if (parent) {
            parent.add(this.orbitGroup);
        }

        // // Set initial position in orbit
        this.group.position.set(orbitRadius, 0, 0);
        this.orbitGroup.add(this.group);


        // Geometry
        const geometry = new THREE.IcosahedronGeometry(size, 12);

        // Day material
        const dayMat = new THREE.MeshStandardMaterial({
            map: this.loader.load(`${texturesPath}/${name}/${dayTexture}`),
            roughness: 1,
            metalness: 0
        });
        this.planetDay = new THREE.Mesh(geometry, dayMat);
        this.planetDay.castShadow = true;
        this.planetDay.receiveShadow = true;
        this.group.add(this.planetDay);

        // Night material
        if (nightTexture) {
            const nightMat = new THREE.MeshBasicMaterial({
                map: this.loader.load(`${texturesPath}/${name}/${nightTexture}`),
                transparent: true,
                opacity: nightOpacity,
                depthWrite: false,
                color: new THREE.Color(1, 1, 0.3)
            });
            this.planetNight = new THREE.Mesh(geometry, nightMat);
            this.planetNight.receiveShadow = false;
            this.group.add(this.planetNight);
        }
        else {
            this.planetNight = null;
        }

        // Cloud material
        if (cloudTexture) {
            const cloudTex = this.loader.load(`${texturesPath}/${name}/${cloudTexture}`);
            const cloudMat = new THREE.MeshStandardMaterial({
                map: cloudTex,
                transparent: true,
                opacity: cloudOpacity,
                blending: THREE.NormalBlending
            });
            this.planetClouds = new THREE.Mesh(geometry, cloudMat);
            this.planetClouds.scale.setScalar(1.01);
            this.group.add(this.planetClouds);
        } 
        else {
            this.planetClouds = null;
        }

        // // Axial tilt
        this.group.rotation.z = this.axialTilt;
        if (this.planetClouds) this.planetClouds.rotation.z = this.axialTilt;
    }   

    // Update night-light visibility
    updateNightLight(sunLight, camera, opacityMultiplier = 0.4) {
        if (!this.planetNight) return;
        
        this._planetPos = new THREE.Vector3();
        this._sunPos = new THREE.Vector3();
        this._camPos = new THREE.Vector3();

        this.group.getWorldPosition(this._planetPos);
        sunLight.getWorldPosition(this._sunPos);
        camera.getWorldPosition(this._camPos);

        const toSun = this._sunPos.sub(this._planetPos).normalize();
        const toCamera = this._camPos.sub(this._planetPos).normalize();

        const dot = toSun.dot(toCamera);

        const nightStrength = THREE.MathUtils.smoothstep(0.2, -0.4, dot);
        this.planetNight.material.opacity = nightStrength * opacityMultiplier;
    }

    // Rotate on own axis + orbit parent
    rotate() {
        this.group.rotation.y += this.axialRotationSpeed;
        if (this.planetClouds) {
            this.planetClouds.rotation.y += this.cloudRotationSpeed;
        }
        if (this.orbitGroup) {
            this.orbitGroup.rotation.y += this.orbitRotationSpeed;
        }
    }

    setPosition(x, y, z) {
        if (x instanceof THREE.Vector3) {
            this.group.position.copy(x);
        }  
        else {
            this.group.position.set(x, y, z);
        }
    }
}
