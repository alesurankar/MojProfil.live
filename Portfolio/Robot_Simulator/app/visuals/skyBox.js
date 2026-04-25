import * as THREE from "three";


export class SkyBox
{
  static Load(name) 
  {
    const loader = new THREE.CubeTextureLoader();
    return loader.load([
      `/Portfolio/Robot_Simulator/app/textures/${name}/n1.png`,
      `/Portfolio/Robot_Simulator/app/textures/${name}/n2.png`,
      `/Portfolio/Robot_Simulator/app/textures/${name}/n3.png`,
      `/Portfolio/Robot_Simulator/app/textures/${name}/n4.png`,
      `/Portfolio/Robot_Simulator/app/textures/${name}/n5.png`,
      `/Portfolio/Robot_Simulator/app/textures/${name}/n6.png`,
    ]);
  }

  static Dispose(cubeTexture) 
  {
    if (cubeTexture) cubeTexture.dispose();
  }
}