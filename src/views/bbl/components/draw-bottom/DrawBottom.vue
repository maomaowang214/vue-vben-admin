<template>
  <BasicDrawer
    v-if="type === 'AddDataHander'"
    :isDetail="true"
    v-bind="$attrs"
    :title="title"
    placement="bottom"
    :mask="false"
    :showDetailBack="false"
    :height="height2"
  >
    <template #titleToolbar>
      <Button style="margin-right: -33px" @click="onFull">
        <template v-if="isFull">
          <FullscreenExitOutlined />
        </template>
        <template v-else>
          <FullscreenOutlined />
        </template>
      </Button>
    </template>
    <iframe ref="redDiv" class="redDiv" scrolling="no" :src="redUrl"></iframe>
  </BasicDrawer>
</template>
<script setup lang="ts">
  import { BasicDrawer } from '@/components/Drawer';
  import { inject, onMounted, ref } from 'vue';
  import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons-vue';
  import { Button } from 'vxe-table';

  let $root: any = inject('$root'); // 获取3D元素

  const type = ref('');
  const title = ref('');
  let isFull = ref(false); // 是否全屏
  const height2 = ref('400px');
  // 正式项目切换成后台生成的token，userID='admin' roleID='root'
  let token =
    // 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiJhZG1pbiIsInJvbGVJRCI6InRlc3QifQ.HPyiyFFcFOx05J4TTtc-EBXCECwBadPQYlWSLO477JM'; // 只读用户
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiJhZG1pbiIsInJvbGVJRCI6InJvb3QifQ.zs6i2joka8Qj5BUJab5G1cBm9-JoEs98o03tGv6LEzM'; // 编辑用户
  let redUrl = ref('http://127.0.0.1:1880/?access_token=' + token);

  onMounted(async () => {
    $root.mitt.on('on-draw-data', (obj) => {
      console.log('默认值', obj);
      type.value = obj.type;
      title.value = obj.title;
    });

    setTimeout(() => {
      $root.scene.token = token; // 给scene设置token
    }, 500);
  });

  /** 全屏 */
  function onFull() {
    isFull.value = !isFull.value;

    if (isFull.value) {
      height2.value = document.documentElement.clientHeight + 'px';
    } else {
      height2.value = '400px';
    }
  }
</script>
<style lang="less" scoped>
  .redDiv {
    width: 100%;
    height: 100%;
  }

  #red-ui-header span.red-ui-header-logo {
    display: none;
  }
</style>
<style>
  .scroll-container .scrollbar__view {
    height: 100%;
  }
</style>
