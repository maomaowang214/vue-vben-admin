import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';
import { t } from '@/hooks/web/useI18n';

const bbl: AppRouteModule = {
  path: '/webgl',
  name: 'WebGL',
  component: LAYOUT,
  redirect: '/webgl/bbl',
  meta: {
    hideChildrenInMenu: true,
    orderNo: 10,
    icon: 'ion:grid-outline',
    title: t('routes.bbl.webgl'),
  },
  children: [
    {
      path: 'bbl',
      name: 'BBL',
      component: () => import('@/views/bbl/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.bbl.title'),
        ignoreKeepAlive: false,
      },
    },
  ],
};

export default bbl;
