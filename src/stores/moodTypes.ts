import { defineStore } from 'pinia';

export const useMoodTypesStore = defineStore({
  id: 'moodTypes',
  state: () => ({
    moodTypes: ['😡', '😭', '🙁', '😐', '🙂', '😁'],
  }),
  getters: {
    getMoodsList: (state) => state.moodTypes,
    //doubleCount: (state) => state.counter * 2,
  },
  actions: {
    // increment() {
    //   this.counter++;
    // },
  },
});
