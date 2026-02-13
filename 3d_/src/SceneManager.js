import { Scenes } from "./Scenes.js";

export class SceneManager 
{
    constructor(scene, camera) 
    {
        this.scene = scene; 
        this.camera = camera;
        this.currentScene = null;
    }

    UpdateCamera()
    {
        const settings = this.currentScene.cameraSettings || {};
        this.camera.position.set(settings.pos.x, settings.pos.y, settings.pos.z);
        this.camera.lookAt(settings.lookAt.x, settings.lookAt.y, settings.lookAt.z);
        this.camera.fov = settings.fov ?? this.camera.fov;
        this.camera.near = settings.near ?? this.camera.near;
        this.camera.far = settings.far ?? this.camera.far;
        this.camera.updateProjectionMatrix();
    }

    LoadScene(sceneClass) 
    {
        this.currentScene = new sceneClass(this.scene, this.camera);
        this.UpdateCamera();
    }

    SwitchScene(sceneName) 
    {
        if (this.currentScene) this.currentScene.Dispose();

        const SceneClass = Scenes[sceneName];
        if (!SceneClass) {
            console.warn(`Scene "${sceneName}" not found in Scenes.js`);
            return;
        }

        this.currentScene = new SceneClass(this.scene, this.camera);
        this.UpdateCamera();
    }

    Update(timeScale) 
    {
        if (this.currentScene) this.currentScene.Update(timeScale);

        const requested = this.currentScene?.requestedScene;
        if (!requested) return;

        this.SwitchScene(requested);
        this.currentScene.requestedScene = null;
    }
}