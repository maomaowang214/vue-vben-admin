import { MeshBuilder } from '@babylonjs/core';
import earcut from 'earcut';

/** 多种网格模型 */

/** 立方体 */
export function CreateBox(scene) {
  MeshBuilder.CreateBox('box', { width: 1, height: 1 }, scene);
}

/** 胶囊 */
export function CreateCapsule(scene) {
  MeshBuilder.CreateCapsule('capsule', {}, scene);
}

/** 圆球 */
export function CreateSphere(scene) {
  MeshBuilder.CreateSphere('sphere', {}, scene);
}

/** 圆柱 */
export function CreateCylinder(scene) {
  MeshBuilder.CreateCylinder('cylinder', scene);
}

/** 圆锥 */
export function CreateCylinderTop(scene) {
  MeshBuilder.CreateCylinder('cylinder', { diameterTop: 0 }, scene);
}

/** 面板 */
export function CreatePlane(scene) {
  MeshBuilder.CreatePlane('plane', { height: 1, width: 1 }, scene);
}

/** 圆形 */
export function CreateDisc(scene) {
  MeshBuilder.CreateDisc('disc', {}, scene);
}

/** 三角形 */
export function CreateTriangle(scene) {
  MeshBuilder.CreateDisc('disc', { tessellation: 3 }, scene);
}

/** 圆环 */
export function CreateTorus(scene) {
  MeshBuilder.CreateTorus('torus', {}, scene);
}

/** 添加3D字体 */
export async function CreateFonts(scene, title: string) {
  const fontData = await (await fetch('/static/fonts/JMH_Regular.json')).json();

  MeshBuilder.CreateText(
    'myText',
    title,
    fontData,
    {
      size: 1,
      resolution: 64, // 分辨率
      depth: 0.1, // 深度
    },
    scene,
    earcut,
  );
}
