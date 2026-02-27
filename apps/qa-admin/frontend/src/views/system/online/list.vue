<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { SystemOnlineApi } from '#/api/system/online';

import { Page } from '@vben/common-ui';

import { message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getOnlineList, kickUser } from '#/api/system/online';
import { $t } from '#/locales';

import { useColumns } from './data';

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useColumns(onActionClick),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async () => {
          const res = await getOnlineList();
          return { ...res, items: res.items ?? [], total: res.total ?? 0 };
        },
      },
    },
    rowConfig: {
      keyField: 'user_id',
    },
    toolbarConfig: {
      custom: true,
      export: false,
      refresh: true,
      search: false,
      zoom: true,
    },
  } as VxeTableGridOptions<SystemOnlineApi.OnlineUser>,
});

function onActionClick(e: OnActionClickParams<SystemOnlineApi.OnlineUser>) {
  if (e.code === 'kick') {
    onKick(e.row);
  }
}

function confirm(content: string, title: string) {
  return new Promise<boolean>((resolve, reject) => {
    Modal.confirm({
      content,
      onCancel() {
        reject(new Error('cancelled'));
      },
      onOk() {
        resolve(true);
      },
      title,
    });
  });
}

async function onKick(row: SystemOnlineApi.OnlineUser) {
  try {
    await confirm(
      $t('system.online.kickConfirm', [row.username ?? row.nickname]),
      $t('system.online.kick'),
    );
    await kickUser(row.user_id);
    message.success($t('system.online.kickSuccess'));
    onRefresh();
  } catch {
    // cancelled
  }
}

function onRefresh() {
  gridApi.query();
}
</script>
<template>
  <Page auto-content-height>
    <Grid :table-title="$t('system.online.list')" />
  </Page>
</template>
