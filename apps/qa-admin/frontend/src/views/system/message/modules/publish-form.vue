<script lang="ts" setup>
import { useVbenDrawer } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { publishMessage } from '#/api/system/message';
import { $t } from '#/locales';

import { usePublishFormSchema } from '../data';

const emits = defineEmits(['success']);

const [Form, formApi] = useVbenForm({
  layout: 'vertical',
  schema: usePublishFormSchema(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1',
});

const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;

    const values = await formApi.getValues();
    const sendToAll = !!values.sendToAll;
    const roleIds = values.roleIds ?? [];
    const userIds = values.userIds ?? [];
    if (!sendToAll && roleIds.length === 0 && userIds.length === 0) {
      const antd = await import('ant-design-vue');
      antd.message.warning($t('system.message.selectTarget'));
      return;
    }

    drawerApi.lock();
    try {
      await publishMessage({
        title: values.title,
        message: values.message,
        link: values.link || undefined,
        roleIds: sendToAll ? [] : roleIds,
        userIds: sendToAll ? [] : userIds,
        sendToAll,
      });
      message.success($t('system.message.publishSuccess'));
      emits('success');
      drawerApi.close();
    } catch {
      drawerApi.unlock();
    }
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      formApi.resetForm();
    }
  },
});
</script>
<template>
  <Drawer class="sm:!w-[540px]" :title="$t('system.message.publish')">
    <Form class="publish-message-form px-1" />
  </Drawer>
</template>

<style scoped>
/* 表单与抽屉内容区同宽 */
.publish-message-form {
  width: 100%;
}

.publish-message-form :deep(.grid) {
  width: 100%;
  min-width: 0;
}

/* 表单项控件区占满可用宽度 */
.publish-message-form :deep(.flex-auto) {
  width: 100%;
  min-width: 0;
}

.publish-message-form :deep(.relative.flex.w-full) {
  min-width: 0;
}

/* textarea 与 Input/Select 同宽 */
.publish-message-form :deep(.ant-input-textarea) {
  display: block;
  width: 100% !important;
  max-width: 100%;
}

.publish-message-form :deep(textarea.ant-input) {
  box-sizing: border-box;
  width: 100% !important;
  min-width: 100%;
  min-height: 120px;
  resize: vertical;
}

.publish-message-form :deep(.ant-input),
.publish-message-form :deep(.ant-select-selector) {
  width: 100% !important;
  min-width: 0;
}

.publish-message-form :deep(.ant-select) {
  width: 100%;
}
</style>
