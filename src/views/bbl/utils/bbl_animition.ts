/** 通用动画封装 */
import { AbstractMesh, Scene, Vector3, Animation } from '@babylonjs/core';

let scene: Scene;

const frameRate = 20; // 帧率
/**
 * 公共动画函数
 */
export function InitAnimations(s: Scene) {
  scene = s;
}

/**
 *
 * @param mesh
 * @param list {xyz: Vector3, time: number} 坐标，时间，速率
 * @returns
 */
export function meshAndRotation(
  mesh: AbstractMesh,
  list: Array<{ xyz: Vector3; time: number }>,
  loop: boolean | undefined,
  speed: number,
) {
  let time = 0;
  const sweep = new Animation(
    mesh.name,
    'rotation',
    frameRate,
    Animation.ANIMATIONTYPE_VECTOR3,
    Animation.ANIMATIONLOOPMODE_CYCLE,
  );

  const keyFrames = [] as any;
  keyFrames.push({
    frame: 0,
    value: mesh.rotation,
  });
  list.forEach((item) => {
    keyFrames.push({
      frame: item.time * frameRate,
      value: item.xyz,
    });
    time += item.time;
  });

  sweep.setKeys(keyFrames);
  mesh.animations[0] = sweep;
  const anim = scene.beginAnimation(mesh, 0, frameRate * time, loop, speed);
  return anim;
}

export function meshAndPostion(
  mesh: AbstractMesh,
  list: Array<{ xyz: Vector3; time: number }>,
  loop: boolean,
  speed: number,
) {
  let time = 0;
  const sweep = new Animation(
    mesh.name,
    'position',
    frameRate,
    Animation.ANIMATIONTYPE_VECTOR3,
    Animation.ANIMATIONLOOPMODE_CYCLE,
  );

  const keyFrames = [] as any;
  const pp = mesh.position.clone();
  keyFrames.push({
    frame: 0,
    value: mesh.position,
  });
  list.forEach((item) => {
    keyFrames.push({
      frame: item.time * frameRate,
      value: new Vector3(pp.x + item.xyz.x, pp.y + item.xyz.y, pp.z + item.xyz.z),
    });
    time += item.time;
  });

  sweep.setKeys(keyFrames);
  mesh.animations[0] = sweep;

  const anim = scene.beginAnimation(mesh, 0, frameRate * time, loop, speed);
  return anim;
}

/**
 * @param type
 * @param name
 * @param xyzList
 * @param loop
 * @param speed
 * 调用通用动画
 */
export function meshAnimation(
  type: number,
  name: string,
  xyzList: any[],
  loop: boolean,
  speed: number,
) {
  const mesh: AbstractMesh = scene.getMeshByName(name) as AbstractMesh;

  if (mesh.animations.length > 0) {
    mesh.animations = [];
  }

  const list: Array<{ xyz: Vector3; time: number }> = [];

  xyzList.forEach((item: { xyz: (number | undefined)[]; time: any }) => {
    const postion = new Vector3(item.xyz[0], item.xyz[1], item.xyz[2]);
    list.push({ xyz: postion, time: item.time });
  });
  if (type === 0) {
    meshAndRotation(mesh, list, loop, speed);
  } else {
    meshAndPostion(mesh, list, loop, speed);
  }
}
