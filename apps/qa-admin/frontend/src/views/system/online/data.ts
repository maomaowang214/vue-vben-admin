import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SystemOnlineApi } from '#/api/system/online';

import { computed } from 'vue';

import { useUserStore } from '@vben/stores';

import { storeToRefs } from 'pinia';

import { $t } from '#/locales';

export function useColumns<T = SystemOnlineApi.OnlineUser>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  const { userInfo } = storeToRefs(useUserStore());
  const currentUserId = computed(() => userInfo.value?.userId ?? '');
  return [
    {
      field: 'username',
      title: $t('system.user.username'),
      width: 140,
    },
    {
      field: 'nickname',
      title: $t('system.user.nickname'),
      width: 140,
    },
    {
      field: 'login_time',
      formatter: 'formatDateTime',
      title: $t('system.online.loginTime'),
      width: 200,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'username',
          nameTitle: $t('system.online.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'kick',
            danger: true,
            show: (row: T) =>
              (row as SystemOnlineApi.OnlineUser).user_id !==
              currentUserId.value,
            text: $t('system.online.kick'),
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: $t('system.user.operation'),
      width: 100,
    },
  ];
}
