<template>
  <canvas id="renderCanvas" class="canvas" ref="canvas"></canvas>
</template>
<script setup lang="ts">
  import { inject, onMounted, ref } from 'vue';
  import * as BABYLON from '@babylonjs/core';
  import '@babylonjs/core/Debug/debugLayer';
  import '@babylonjs/inspector';
  import mitt from 'mitt';
  import { initScene, cleanScene } from '../utils/bbl_common';

  let canvas = ref();
  let scene: BABYLON.Scene, engine;

  let $root: any = inject('$root'); // 获取3D元素

  onMounted(async () => {
    $root.mitt = mitt();
    engine = await createEngine();
    main();

    $root.mitt.on('INIT-SCENE', async () => {
      if ($root.scene) {
        cleanScene($root);
        engine = await createEngine();
        main();
      }
    });
  });

  async function createEngine() {
    const webGPUSupported = await BABYLON.WebGPUEngine.IsSupportedAsync;
    if (webGPUSupported) {
      const engine = new BABYLON.WebGPUEngine(canvas.value, {
        glslangOptions: {
          jsPath: '/static/bbl_file/glslang/glslang.js',
          wasmPath: '/static/bbl_file/glslang/glslang.wasm',
        },
        twgslOptions: {
          jsPath: '/static/bbl_file/twgsl/twgsl.js',
          wasmPath: '/static/bbl_file/twgsl/twgsl.wasm',
        },
      });
      await engine.initAsync();
      return engine;
    }
    return new BABYLON.Engine(canvas.value, true);
  }

  const createScene = async () => {
    const scene1 = new BABYLON.Scene(engine);

    // scene.freezeActiveMeshes(); // 冻结活动网格
    // scene.skipPointerMovePicking = true; // 指针移动时不拾取场景

    scene1.debugLayer.show();
    initScene(scene1);

    // 模型解压配置
    BABYLON.DracoCompression.Configuration = {
      decoder: {
        wasmUrl: '/babylon-draco-files/draco_wasm_wrapper_gltf.js',
        wasmBinaryUrl: '/babylon-draco-files/draco_decoder_gltf.wasm',
        fallbackUrl: '/babylon-draco-files/draco_decoder_gltf.js',
      },
    };

    const camera = new BABYLON.ArcRotateCamera(
      '弧旋转摄像机',
      0,
      0,
      10,
      BABYLON.Vector3.Zero(),
      scene1,
    );
    camera.attachControl(canvas.value, true);
    camera.lowerBetaLimit = Math.PI / 4; // 设置旋转上下限制
    camera.upperBetaLimit = Math.PI / 2;

    camera.lowerRadiusLimit = 5;
    camera.upperRadiusLimit = 100;

    camera.wheelPrecision = 50; // 鼠标滚动参数

    scene1.createDefaultLight();
    // 灯光设置
    const hemiLight = new BABYLON.HemisphericLight('半球光', new BABYLON.Vector3(0, 10, 0), scene1);
    hemiLight.intensity = 1;

    scene1.onPointerDown = function castRay() {
      const hit: any = scene1.pick(scene1.pointerX, scene1.pointerY);
      if (hit.pickedMesh && hit.pickedMesh.name === 'JE01_M01_A03') {
        hit.pickedMesh.material = new BABYLON.StandardMaterial('material' + hit.pickedMesh.name);
        hit.pickedMesh.material.diffuseColor = BABYLON.Color3.Red();
      }
    };

    // 渲染之前函数
    scene1.registerBeforeRender(() => {});

    return scene1;
  };

  const main = async () => {
    scene = await createScene();
    $root.scene = scene; // 赋值给全局变量

    engine.runRenderLoop(() => {
      scene.render();
    });
  };
</script>
<style lang="less" scoped>
  .canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding-top: 50px;
    touch-action: none;
    //   pointer-events: none;
  }
</style>
<style>
  #scene-explorer-host {
    z-index: 100;
    height: 100%;
    padding-top: 50px;
  }

  #inspector-host {
    height: 100%;
    padding-top: 50px;
  }
</style>
