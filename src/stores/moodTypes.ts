import { clearIDB, deleteDBMoodRecord, getDBMoodRecords, getDBMoodsList, saveDBMoodRecord } from '@/api/idb';
import { add } from 'date-fns';
import { defineStore, storeToRefs } from 'pinia';

export type RootState = {
  moodTypes: DBMood[];
  moodRecords: DBMoodRecord[];
  statsAverageLabels: string[];
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

export type PercentsObject = {
  week?: number;
  month?: number;
  year?: number;
};

export const useMoodTypesStore = defineStore({
  id: 'moodTypes',
  state: (): RootState => ({
    moodTypes: [],
    moodRecords: [],
    statsAverageLabels: ['Terrible', 'Bad', 'BelowAverage', 'Average', 'Good', 'Great'],
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
    moodPeriodsPercent(state): PercentsObject {
      const percentObject: PercentsObject = {};
      if (state.moodRecords.length === 0) return {};
      if (this.moodRecordListByPeriods?.week.length !== 0) {
        percentObject.week =
          ((this.moodRecordListByPeriods.week.reduce((acc: number, cur: DBMoodRecord) => acc + cur.mood_id, 0) / this.moodRecordListByPeriods.week.length) *
            100) /
          state.moodTypes.length;
      }
      if (this.moodRecordListByPeriods?.month.length !== 0) {
        percentObject.month =
          ((this.moodRecordListByPeriods.month.reduce((acc: number, cur: DBMoodRecord) => acc + cur.mood_id, 0) / this.moodRecordListByPeriods.month.length) *
            100) /
          state.moodTypes.length;
      }
      if (this.moodRecordListByPeriods?.year.length !== 0) {
        percentObject.year =
          ((this.moodRecordListByPeriods.year.reduce((acc: number, cur: DBMoodRecord) => acc + cur.mood_id, 0) / this.moodRecordListByPeriods.year.length) *
            100) /
          state.moodTypes.length;
      }

      return percentObject;
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
