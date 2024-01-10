import { defHttp } from '@/utils/http/axios';

enum Api {
  FlowsList = '/flows',
  AddFlow = '/flow',
}

/** nodered 服务 */

/** 获取所有流信息 */
export const getFlowsList = () => {
  return defHttp.get<any>({ url: Api.FlowsList });
};

/** 设置流信息 */
export const setFlowsList = (params) => {
  return defHttp.post({ url: Api.FlowsList, params });
};

/** 添加选项卡 */
export const addFlow = (params) => {
  return defHttp.post({ url: Api.AddFlow, params });
};
