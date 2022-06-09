import { clearIDB, deleteDBMoodRecord, getDBMoodRecords, getDBMoodsList, saveDBMoodRecord } from '@/api/idb';
import { add } from 'date-fns';
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
  getters: {
    moodRecordListByPeriods: (state): { week: DBMoodRecord[]; month: DBMoodRecord[]; year: DBMoodRecord[] } => {
      const today = new Date();
      const weekArray: DBMoodRecord[] = [];
      const monthArray: DBMoodRecord[] = [];
      const yearArray: DBMoodRecord[] = [];
      const minWeekDate = add(today, { days: -7 });
      const minMonthDate = add(today, { months: -1 });
      const minYearDate = add(today, { years: -1 });
      state.moodRecords.forEach((r) => {
        if (new Date(r.date) >= minWeekDate && new Date(r.date) <= today) weekArray.push(r);
        if (new Date(r.date) >= minMonthDate && new Date(r.date) <= today) monthArray.push(r);
        if (new Date(r.date) >= minYearDate && new Date(r.date) <= today) yearArray.push(r);
      });
      return {
        week: weekArray,
        month: monthArray,
        year: yearArray,
      };
    },
  },
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
