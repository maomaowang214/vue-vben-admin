<!-- 进度条 -->
<template>
  <div class="loadding" v-if="finish">
    <Progress
      class="progress"
      type="circle"
      :stroke-color="{
        '0%': '#108ee9',
        '100%': '#87d068',
      }"
      :percent="value"
    >
      <template #format="percent">
        <span style="color: #fff"> {{ percent }}</span>
      </template>
    </Progress>
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { Progress } from 'ant-design-vue';

  let value = ref();
  let finish = ref(false);
  // let title = ref('');

  // watch(
  //   () => bblStore.getProgressInfo,
  //   (val: any) => {
  //     finish.value = val.finish;
  //     title.value = val.name;
  //     value.value = val.value;
  //   },
  // );
</script>
<style lang="less" scoped>
  .progress {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .loadding {
    position: relative;
    z-index: 200;
    width: 100%;
    height: 100%;
  }
</style>
