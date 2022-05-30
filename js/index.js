import { OrbitControls } from 'https://unpkg.com/three@0.119.1/examples/jsm/controls/OrbitControls.js';
import * as THREE from 'https://unpkg.com/three@0.119.1/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/GLTFLoader.js'

window.addEventListener('DOMContentLoaded', init);

let width, height, camera, pointLight, scene, renderer;
let rot = 0;

function init() {
    // レンダラーを作成
        renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#canvas'),
        alpha: true,
    });

    // ウィンドウサイズ設定
    renderer.setPixelRatio(1);
    renderer.setSize(window.innerWidth,window.innerHeight);
    console.log(window.devicePixelRatio);
    console.log(width + ", " + height);

    // シーンを作成
    scene = new THREE.Scene();

    // カメラを作成
    camera = new THREE.PerspectiveCamera(
        45, 
        window.innerWidth / window.innerHeight,
        100, 
        20000
        );
    camera.position.set(11000, 6000, 10000);
    camera.aspect = window.innerWidth / innerHeight;
    camera.updateProjectionMatrix ();

    const controls = new OrbitControls(camera, renderer.domElement);

    // Load GLB
    const loader = new GLTFLoader();
    const url = 'mimi.glb';

    let model = null;
    loader.load(
        url,
        function (gltf) {
            model = gltf.scene;
            // model.name = "model_with_cloth";
            model.scale.set(400.0, 400.0, 400.0);
            model.position.set(0, -400, 0);
            scene.add(gltf.scene);

            // model["test"] = 100;
        },
        function (error) {
            console.log('An error happened');
            console.log(error);
        }
    );
    renderer.gammaOutput = true;
    renderer.gammaFactor = 2.2;

    // 平行光源
    const light = new THREE.DirectionalLight(0xFFFFFF);
    light.intensity = 2; // 光の強さを倍に
    light.position.set(1, 1, 1);
    scene.add(light);

    //ポイント光源を追加
    pointLight = new THREE.PointLight(0xffffff,2);
    pointLight.position.set(5000,5000,5000)

     //ポイントライトヘルパー追加
     let pointLightHelper = new THREE.PointLightHelper(pointLight,200);
     scene.add(pointLightHelper);
     scene.add(pointLight);
    
    // 初回実行
    //tick();
    animate();
    window.addEventListener("resize",onWindowResize);

    // function tick() {
    //    controls.update();
    //
    //    if (model != null) {
    //        console.log(model);
    //    }
    //    renderer.render(scene, camera);
    //    requestAnimationFrame(tick);
    // }

}

//ブラウザのリサイズに対応させる
function onWindowResize(){
    renderer.setSize(window.innerWidth, innerHeight);
    
    //カメラのアスペクト比を正す
    camera.aspect = window.innerWidth / innerHeight;
    camera.updateProjectionMatrix ();
    
    }   

    
function animate(){
    //ポイント光源を球の周りを巡回させよう
    pointLight.position.set(
        2000 * Math.sin(Date.now() / 500),
        2000 * Math.sin(Date.now() / 1000),
        2000 * Math.cos(Date.now() / 500)
    );
    scene.add(pointLight);
    //レンダリングする
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
    
    //カメラを回す
    rot += 0.5;
    let radian = rot *(Math.PI / 180);
    camera.position.x = Math.sin(radian) * 10000;
    camera.position.z = Math.cos(radian) * 10000;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
}
