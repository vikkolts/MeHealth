import { deleteDBMoodRecord, getDBMoodRecords, saveDBMoodRecord } from '@/api/idb';
import { defineStore } from 'pinia';

export type RootState = {
  moodTypes: string[];
  moodRecords: DBMoodRecord[];
};

export type DBMoodRecord = {
  id: number;
  date: Date;
  mood_id: Number;
  notes?: String;
};

export type MoodRecord = {
  date: String;
  mood_id: Number;
  notes?: String;
};

export const useMoodTypesStore = defineStore({
  id: 'moodTypes',
  state: (): RootState => ({
    moodTypes: ['😡', '😭', '🙁', '😐', '🙂', '😁'],
    moodRecords: [],
  }),
  getters: {},
  actions: {
    async saveMoodRecord(formData: MoodRecord) {
      return await saveDBMoodRecord(formData);
    },
    async getMoodRecordsList() {
      this.moodRecords = [];
      let result: DBMoodRecord[] = await getDBMoodRecords();
      this.moodRecords.push(...result);
    },

    async deleteMoodRecord(id: DBMoodRecord['id']) {
      return await deleteDBMoodRecord(id);
    },
  },
});
