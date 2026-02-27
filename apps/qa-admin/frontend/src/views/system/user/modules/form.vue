<script lang="ts" setup>
import type { SystemUserApi } from '#/api/system/user';

import { computed, nextTick, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { createUser, updateUser } from '#/api/system/user';
import { $t } from '#/locales';

import { useEditFormSchema, useFormSchema } from '../data';

const emits = defineEmits(['success']);

const formData = ref<SystemUserApi.SystemUser>();

const id = ref<string>();
const isEdit = computed(() => !!id.value);

const [Form, formApi] = useVbenForm({
  schema: computed(() =>
    isEdit.value ? useEditFormSchema(formData.value) : useFormSchema(),
  ),
  showDefaultActions: false,
});

const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;

    const values = await formApi.getValues();
    if (isEdit.value && !values.password) {
      delete values.password;
    }

    drawerApi.lock();
    try {
      if (id.value) {
        await updateUser(id.value, values);
      } else {
        await createUser(values);
      }
      emits('success');
      drawerApi.close();
    } catch {
      drawerApi.unlock();
    }
  },

  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<SystemUserApi.SystemUser>();
      formApi.resetForm();

      if (data?.id) {
        formData.value = data;
        id.value = data.id;
        await nextTick();
        formApi.setValues({
          username: data.username,
          nickname: data.nickname,
          status: data.status,
          roleIds: data.roleIds ?? [],
        });
      } else {
        formData.value = undefined;
        id.value = undefined;
      }
    }
  },
});

const getDrawerTitle = computed(() => {
  return formData.value?.id
    ? $t('common.edit', $t('system.user.name'))
    : $t('common.create', $t('system.user.name'));
});
</script>
<template>
  <Drawer :title="getDrawerTitle">
    <Form />
  </Drawer>
</template>
