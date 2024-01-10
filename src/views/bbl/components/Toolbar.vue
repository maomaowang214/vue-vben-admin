<template>
  <div>
    <template v-for="(item, i) in position">
      <div :key="i" v-if="item.isVisible" class="meshgj" :style="{ left: item.x, top: item.y }">
        <!-- <Radial /> -->
        <VxeButton>123123</VxeButton>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue';

  // div实时位置
  let position = ref([
    {
      x: '0px',
      y: '0px',
      isVisible: false,
    },
  ]);
</script>
<style lang="less" scoped>
  .meshgj {
    position: absolute;
    z-index: 100;
  }
</style>
