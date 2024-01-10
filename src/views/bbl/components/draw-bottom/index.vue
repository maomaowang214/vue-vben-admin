<template>
  <DrawBottom @register="register" />
</template>
<script setup lang="ts">
  import { useDrawer } from '@/components/Drawer';
  import { inject, onMounted } from 'vue';
  import DrawBottom from './DrawBottom.vue';

  let $root: any = inject('$root'); // 获取3D元素
  const [register, { openDrawer }] = useDrawer();

  onMounted(() => {
    // 通过监听变量判断是否打开抽屉
    // openDrawer();
    $root.mitt.on('on-draw-data', () => {
      setTimeout(() => {
        openDrawer();
      }, 200);
    });
  });
</script>
