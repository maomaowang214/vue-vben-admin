import { defineStore } from 'pinia';
import { store } from '@/store';

interface BBLState {}

export const useBBLStore = defineStore({
  id: 'app-bbl',
  state: (): BBLState => ({}),
  getters: {},
  actions: {},
});

// 需要在设置之外使用
export function useBBLStoreWithOut() {
  return useBBLStore(store);
}
