<template>
  <VxeModal
    v-model="isVis"
    v-if="isVis"
    :title="title"
    resize
    @close="cancel"
    :mask="false"
    :lock-view="false"
  >
    <template #default>
      <!-- 添加3D文字 -->
      <AddFonts v-if="type === 'AddFonts'" />
    </template>
  </VxeModal>
</template>
<script setup lang="ts">
  import { inject, onMounted, ref } from 'vue';
  import { VxeModal } from 'vxe-table';
  import AddFonts from './AddFonts.vue';

  let $root: any = inject('$root'); // 获取3D元素

  let isVis = ref(false);
  let title = ref('');
  let type = ref('');

  onMounted(() => {
    $root.mitt.on('on-modal-fonts', (obj) => {
      isVis.value = true;
      title.value = obj.title;
      type.value = obj.type;
    });
  });

  function cancel() {
    isVis.value = false;
  }
</script>
