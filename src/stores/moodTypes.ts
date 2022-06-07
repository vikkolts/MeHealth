import { clearIDB, deleteDBMoodRecord, getDBMoodRecords, getDBMoodsList, saveDBMoodRecord } from '@/api/idb';
import { defineStore } from 'pinia';

export type RootState = {
  moodTypes: DBMood[];
  moodRecords: DBMoodRecord[];
};

export type DBMoodRecord = {
  id?: number;
  date: string;
  mood_id: number;
  notes?: string;
};

export interface DBMood {
  id: number;
  emoji: string;
}

export const useMoodTypesStore = defineStore({
  id: 'moodTypes',
  state: (): RootState => ({
    moodTypes: [],
    moodRecords: [],
  }),
  getters: {},
  actions: {
    async saveMoodRecord(formData: DBMoodRecord) {
      return await saveDBMoodRecord(formData);
    },

    async getMoodRecordsList(date_from?: string, date_to?: string) {
      this.moodRecords = [];
      this.moodRecords = (await getDBMoodRecords(date_from, date_to)) || [];
      return this.moodRecords;
    },

    async deleteMoodRecord(id: DBMoodRecord['id']) {
      return await deleteDBMoodRecord(id);
    },

    async getMoodsList() {
      this.moodTypes = [];
      this.moodTypes = (await getDBMoodsList()) || [];
      return this.moodTypes;
    },

    async cleanDataBase() {
      return await clearIDB();
    },
  },
});
