import { Scene } from '@babylonjs/core';

/** 监听uibuilder数据 */
export function onUibuilderData(msg, scene: Scene) {
  const modelName = msg.topic;
  const value = Number(msg.value);
  const mesh = scene.getMeshByName(modelName);

  console.log(123);

  if (mesh?.animations.length) {
    if (value) {
      scene.beginAnimation(mesh, 0, 100, true);
    } else {
      scene.beginAnimation(mesh, 100, 200, true);
    }
  }
}
