import * as THREE from "three";

export class SkyBox
{
    static Load(name) 
    {
        const loader = new THREE.CubeTextureLoader();
        return loader.load([
            `./3d_/app/textures/${name}/n1.png`,
            `./3d_/app/textures/${name}/n2.png`,
            `./3d_/app/textures/${name}/n3.png`,
            `./3d_/app/textures/${name}/n4.png`,
            `./3d_/app/textures/${name}/n5.png`,
            `./3d_/app/textures/${name}/n6.png`,
        ]);
    }

    static Dispose(cubeTexture) 
    {
        if (cubeTexture) cubeTexture.dispose();
    }
}