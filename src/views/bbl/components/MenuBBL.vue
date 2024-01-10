<template>
  <Menu
    class="top-sider"
    v-model:selectedKeys="current"
    mode="horizontal"
    theme="dark"
    :items="items"
    @click="selectClick"
  />
</template>
<script setup lang="ts">
  import { Menu, MenuProps } from 'ant-design-vue';
  import { h, inject, onMounted, ref } from 'vue';
  import {
    WechatFilled,
    FileTextOutlined,
    EditOutlined,
    FileAddOutlined,
    LayoutFilled,
    DatabaseFilled,
  } from '@ant-design/icons-vue';
  import { VXETable } from 'vxe-table';
  import { exportGLTF, importGltfs } from '../utils/bbl_common';
  import {
    CreateBox,
    CreateCapsule,
    CreateCylinder,
    CreateCylinderTop,
    CreateDisc,
    CreatePlane,
    CreateSphere,
    CreateTorus,
    CreateTriangle,
  } from '../utils/bbl_meshs';

  let $root: any = inject('$root'); // 获取3D元素
  const current = ref<string[]>(['mail']);

  const items = ref<MenuProps['items']>();

  onMounted(() => {
    items.value = [
      {
        key: 'file',
        icon: () => h(FileTextOutlined),
        label: '文件',
        title: '文件',
        children: [
          {
            key: 'new-scene',

            label: '新建场景',
          },
          {
            key: 'import',

            label: '导入GLB/GLTF',
          },
          {
            key: 'export',

            label: '导出',
          },
          {
            key: 'save',

            label: '保存到云端',
          },
        ],
      },
      {
        key: 'edit',
        icon: () => h(EditOutlined),
        label: '编辑',
        title: '编辑',
        children: [
          {
            key: 'undo',

            label: '撤销',
          },
          {
            key: 'redo',

            label: '重做',
          },
          {
            key: 'cleanHistory',

            label: '清除记录',
          },
          { type: 'divider' },
          {
            key: 'clone',

            label: '克隆',
          },
          {
            key: 'delete',

            label: '删除',
          },
        ],
      },
      {
        key: 'object',
        icon: () => h(FileAddOutlined),
        label: '添加',
        title: '添加',
        children: [
          {
            key: 'mesh',
            label: '网格',
            children: [
              {
                key: 'box',
                label: '方形',
              },
              {
                key: 'capsule',
                label: '胶囊形',
              },
              {
                key: 'circle',
                label: '圆形',
              },
              {
                key: 'cylinder',
                label: '圆柱体',
              },
              {
                key: 'CylinderTop',
                label: '圆锥',
              },
              {
                key: 'Triangle',
                label: '三角形',
              },
              {
                key: 'Plane',
                label: '面板',
              },
              {
                key: 'Ring',
                label: '环形面板',
              },
              {
                key: 'Sphere',
                label: '球体',
              },
              {
                key: 'Torus',
                label: '环形体',
              },
              {
                key: 'Tube',
                label: '圆管',
              },
            ],
          },
          { type: 'divider' },
          {
            key: 'fonts',
            label: '文字',
          },
        ],
      },
      {
        key: 'window',
        icon: () => h(LayoutFilled),
        label: '窗口',
        title: '窗口',
        children: [
          {
            label: '全屏',
            key: 'fullscreen',
          },
          {
            label: '退出全屏',
            key: 'closeScreen',
          },
          { type: 'divider' },
          {
            label: '截屏（编辑器）',
            key: 'screenshot',
          },
          {
            label: '录屏',
            key: 'video',
          },
        ],
      },
      {
        key: 'data',
        icon: () => h(DatabaseFilled),
        label: '数据绑定',
        title: '数据绑定',
      },
      {
        key: 'help',
        icon: () => h(WechatFilled),
        label: '帮助',
        title: '帮助',
        children: [
          {
            label: '文档',
            key: 'dom',
          },
          {
            label: '技术支持',
            key: 'help',
          },
        ],
      },
    ];
  });

  function selectClick(item: any) {
    let key = item.key;
    console.log(key);

    switch (key) {
      case 'new-scene':
        confirmEvent();
        break;
      case 'import':
        //导入模型
        selectFiles();
        break;
      case 'export':
        exportGLTF(0);
        break;
      case 'save':
        exportGLTF(1);
        VXETable.modal.message({ content: `正在执行保存数据操作...` });
        break;
      case 'box':
        CreateBox($root.scene); // 立方体
        break;
      case 'capsule':
        CreateCapsule($root.scene); // 胶囊
        break;
      case 'cylinder':
        CreateCylinder($root.scene); // 圆柱
        break;
      case 'CylinderTop':
        CreateCylinderTop($root.scene); // 圆锥
        break;
      case 'Sphere':
        CreateSphere($root.scene); // 球
        break;
      case 'Plane':
        CreatePlane($root.scene); // 面板
        break;
      case 'Triangle':
        CreateTriangle($root.scene); // 三角形
        break;
      case 'circle':
        CreateDisc($root.scene); // 圆形
        break;
      case 'Tube':
        CreateTorus($root.scene); // 圆环
        break;
      case 'fonts':
        $root.mitt.emit('on-modal-fonts', {
          title: '添加文字',
          type: 'AddFonts', // 对应的目录modal下的模板
        });
        break;
      case 'data':
        $root.mitt.emit('on-draw-data', {
          title: '数据绑定',
          type: 'AddDataHander', // 对应的目录modal下的模板
        });
        break;
    }
  }

  // 导入模型
  const selectFiles = async () => {
    try {
      const { files } = await VXETable.readFile({
        types: ['glb', 'gltf', 'babylon', 'bin'],
        multiple: true,
      });
      importGltfs(files);
    } catch (e) {
      console.log(e);
    }
  };

  const confirmEvent = async () => {
    const type = await VXETable.modal.confirm('您确定要新建场景吗？此操作将删除场景内容！');
    if (type === 'confirm') {
      $root.mitt.emit('INIT-SCENE');
    }
  };
</script>
<style lang="less" scoped>
  .top-sider {
    display: flex;
    position: absolute;
    z-index: 101;
    top: 0;
    left: 0;
    align-items: center;
    width: 100%;
    height: 50px;
    border-bottom: 1px solid #444;
    background: #333;
  }
</style>
