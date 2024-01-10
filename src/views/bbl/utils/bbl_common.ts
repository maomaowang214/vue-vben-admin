import {
  BackgroundMaterial,
  Camera,
  Color3,
  Light,
  Mesh,
  MeshBuilder,
  PBRMaterial,
  Scene,
  SceneLoader,
  StandardMaterial,
  Texture,
} from '@babylonjs/core';
import { GLTF2Export, GLTFData } from '@babylonjs/serializers';
import { GridMaterial } from '@babylonjs/materials/Grid';

let scene: Scene;
/** 初始化scene */
export function initScene(ss: Scene) {
  scene = ss;
}

/** 加载渲染多个模型 */
export function importGltfs(modelInfo) {
  const promises: any[] = [];
  for (const key in modelInfo) {
    if (Object.prototype.hasOwnProperty.call(modelInfo, key)) {
      const item = modelInfo[key];
      const promise = importGltf(item);
      promises.push(promise);
    }
  }
  Promise.all(promises).then((res) => {
    // res.forEach((item) => {
    //   // item.addAllToScene();
    //   // let meshs = item.transformNodes; //获取模组集合/网格
    //   // meshs.forEach((mesh: any) => {
    //   //   mesh.setParent(null);
    //   //   // mesh.parent = rootMesh;
    //   // });
    // });

    // 计算自适应
    // rootMesh.isVisible = false;

    // let { min, max } = rootMesh.getHierarchyBoundingVectors(true);
    // let boundingInfo = new BoundingInfo(min, max);
    // fixModel(boundingInfo, scene.activeCamera, scene);

    addOrRemoveGrid(); // 网格地面
    console.log('加载完成', res);
  });
}

// 导入
function importGltf(item): Promise<any> {
  return SceneLoader.ImportMeshAsync('', '', item, scene, (progress) => {
    const num = Number((progress.loaded / progress.total).toFixed(2)) * 100;
    console.log('加载进度', num);
  });
  // return SceneLoader.LoadAssetContainerAsync(filePath, fileName, scene, (progress) => {
  //   const num = Number((progress.loaded / progress.total).toFixed(2)) * 100;
  //   // bblStore.setProgressInfo({
  //   //   name: fileName,
  //   //   value: num,
  //   //   finish: true,
  //   // });
  // });
}

/** 导出gltf模型 type: 0 表示导出， 1表示保存到数据库 */
export function exportGLTF(type: number) {
  const options = {
    shouldExportNode: function (node) {
      if (node instanceof Mesh) {
        if (node.material) {
          const material = node.material as PBRMaterial | StandardMaterial | BackgroundMaterial;
          const reflectionTexture = material.reflectionTexture;
          if (reflectionTexture && reflectionTexture.coordinatesMode === Texture.SKYBOX_MODE) {
            return false;
          }
        }
      }

      if (node instanceof Camera) {
        return false;
      }

      if (node instanceof Light) {
        return false;
      }

      if (node.name === '__root__') return false;
      if (node.name === '网格地面') return false;

      return true;
    },
  };

  GLTF2Export.GLBAsync(scene, 'fileName', options).then((gltf: GLTFData) => {
    if (type) {
      // 保存到数据库
      console.log('保存到数据库');
    } else {
      gltf.downloadFiles();
    }
  });
}

// 网格地面
let _gridMesh;
function addOrRemoveGrid() {
  if (!_gridMesh) {
    const extend = scene.getWorldExtends();
    const width = (extend.max.x - extend.min.x) * 5.0;
    const depth = (extend.max.z - extend.min.z) * 5.0;

    _gridMesh = MeshBuilder.CreateGround(
      '网格地面',
      { width: 1, height: 1, subdivisions: 1 },
      scene,
    );
    _gridMesh.scaling.x = Math.max(width, depth);
    _gridMesh.scaling.z = _gridMesh.scaling.x;

    const groundMaterial = new GridMaterial('GridMaterial', scene);
    groundMaterial.majorUnitFrequency = 10;
    groundMaterial.minorUnitVisibility = 0.3;
    groundMaterial.gridRatio = 0.01;
    groundMaterial.backFaceCulling = false;
    groundMaterial.mainColor = new Color3(1, 1, 1);
    groundMaterial.lineColor = new Color3(1.0, 1.0, 1.0);
    groundMaterial.opacity = 0.8;
    groundMaterial.zOffset = 1.0;
    groundMaterial.opacityTexture = new Texture('/static/imgs/backgroundGround.png', scene);

    _gridMesh.position.y = _gridMesh.position.y - 0.5;
    _gridMesh.material = groundMaterial;
    _gridMesh.isPickable = false;
    _gridMesh.doNotSyncBoundingInfo = true;
  }
}

/** 清理场景 */
export function cleanScene(root: any) {
  // 禁用单击或拾取你的网格
  // mesh.isPickable = false;
  // mesh.doNotSyncBoundingInfo = true;

  // 如果有不会改变位置、旋转或大小的网格，那么通过调用“冻结”网格会变得非常有效
  // mesh.freezeWorldMatrix();
  // 即使它们确实发生变化，但会间歇性地发生变化，你也可以通过调用以下命令重新打开世界矩阵计算
  // mesh.unfreezeWorldMatrix();

  // 移除缓存的顶点数据
  // scene.clearCachedVertexData();
  // console.log("scene", scene);
  const scene: Scene = root.scene;
  const meshs = scene.meshes;
  const materials = scene.materials;
  const textures = scene.textures;
  const geometries = scene.geometries;
  if (meshs.length > 0) {
    meshs.forEach((m) => {
      scene.removeMesh(m);
      m.dispose(true, true);
    });
  }
  if (materials.length > 0) {
    materials.forEach((mateerial) => {
      scene.removeMaterial(mateerial);
      mateerial.dispose(true, true);
    });
  }
  if (textures.length > 0) {
    textures.forEach((t) => {
      scene.removeTexture(t);
      t.dispose();
    });
  }
  if (geometries.length > 0) {
    geometries.forEach((g) => {
      scene.removeGeometry(g);
      g.dispose();
    });
  }

  scene.getEngine().dispose();
  scene.dispose();
  scene.clearCachedVertexData();
  console.log('清理后场景信息', scene);
  root.scene = null;

  // 重新创建场景
  // root.mitt.emit("INIT-SCENE");

  // 清除地面网格
  if (_gridMesh) {
    _gridMesh.dispose(true, true);
    _gridMesh = null;
  }
}
