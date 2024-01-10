<template>
  <div>
    3D文字内容：
    <vxe-input v-model="val1" placeholder="请输入..." />
    <vxe-button status="primary" content="确定" @click="saveFonts" />
  </div>
</template>
<script setup lang="ts">
  import { inject, ref } from 'vue';
  import { CreateFonts } from '../../utils/bbl_meshs';

  let $root: any = inject('$root'); // 获取3D元素

  const val1 = ref('');

  function saveFonts() {
    CreateFonts($root.scene, val1.value); // 字体
  }
</script>
