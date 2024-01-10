<template>
  <div class="root">
    <WebGPU />
    <MenuBBL />
    <!-- 动态mesh工具栏 -->
    <Toolbar />
    <!-- 底部抽屉 -->
    <DrawBottom />
    <ModalBBL />
    <!-- loadding -->
    <Loadding />
  </div>
</template>
<script lang="ts">
  import Toolbar from './components/Toolbar.vue';
  import WebGPU from './components/webgl.vue';
  import DrawBottom from './components/draw-bottom/index.vue';
  import MenuBBL from './components/MenuBBL.vue';
  import ModalBBL from './components/modal/index.vue';
  import Loadding from './components/Loadding.vue';
  import { defineComponent, onMounted, inject } from 'vue';
  import { onUibuilderData } from './utils/bbl_uibuilder';

  export default defineComponent({
    name: 'BBL',
    components: { Toolbar, WebGPU, DrawBottom, MenuBBL, ModalBBL, Loadding },
    setup() {
      onMounted(async () => {
        let uibuilder: any = inject('$uibuilder'); // 获取3D元素
        let $root: any = inject('$root'); // 获取3D元素
        let dd: any = document.getElementsByClassName('vben-layout-content-scroll');
        if (dd) dd[0].style.height = '100%';

        await uibuilder.start({ ioNamespace: '/bbl' });
        console.log('send2NR', uibuilder);

        // 监听red数据
        uibuilder.onChange('msg', (msg: any) => {
          console.log('msg', msg);
          onUibuilderData(msg, $root.scene);
        });

        uibuilder.send({
          topic: ['浏览器访问信息'],
        });
      });
    },
  });
</script>

<style lang="less" scoped>
  .root {
    position: relative;
    width: 100%;
    height: 100%;
  }
</style>
