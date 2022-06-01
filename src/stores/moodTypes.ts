import { clearIDB, deleteDBMoodRecord, getDBMoodRecords, saveDBMoodRecord } from '@/api/idb';
import { defineStore } from 'pinia';

export type RootState = {
  moodTypes: string[];
  moodRecords: DBMoodRecord[];
};

export type DBMoodRecord = {
  id?: number;
  date: string;
  mood_id: number;
  notes?: string;
};

export const useMoodTypesStore = defineStore({
  id: 'moodTypes',
  state: (): RootState => ({
    moodTypes: ['😡', '😭', '🙁', '😐', '🙂', '😁'],
    moodRecords: [],
  }),
  getters: {},
  actions: {
    async saveMoodRecord(formData: DBMoodRecord) {
      return await saveDBMoodRecord(formData);
    },

    async getMoodRecordsList() {
      this.moodRecords = [];
      this.moodRecords = (await getDBMoodRecords()) || [];
    },

    async deleteMoodRecord(id: DBMoodRecord['id']) {
      return await deleteDBMoodRecord(id);
    },

    async cleanDataBase() {
      return await clearIDB();
    },
  },
});
