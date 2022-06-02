import type { DBMood, DBMoodRecord } from '@/stores/moodTypes';

const DB_NAME: string = 'me-health-db';
const DB_VERSION: number = 3;
let DB: IDBDatabase;

export async function getDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (DB) {
      return resolve(DB);
    }
    console.log('OPENING DB', DB);
    let request: IDBOpenDBRequest = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (e: Event) => {
      console.log('Error opening db', e);
      reject({ title: 'Error opening db', message: (e.target as IDBOpenDBRequest)?.error });
    };

    request.onsuccess = (e: Event) => {
      DB = (e.target as IDBOpenDBRequest).result;
      resolve(DB);
    };

    request.onupgradeneeded = (e: IDBVersionChangeEvent) => {
      console.log('onupgradeneeded');
      let db: IDBDatabase = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('moodRecords')) {
        let objectRecordsStore: IDBObjectStore = db.createObjectStore('moodRecords', { autoIncrement: true, keyPath: 'id' });
        objectRecordsStore.createIndex('date', 'date', { unique: true });
        objectRecordsStore.createIndex('mood_id', 'mood_id', { unique: false });
        objectRecordsStore.createIndex('notes', 'notes', { unique: false });
      }
      if (!db.objectStoreNames.contains('moods')) {
        let objectMoodsStore: IDBObjectStore = db.createObjectStore('moods', { keyPath: 'id' });
        objectMoodsStore.createIndex('emoji', 'emoji', { unique: true });
        objectMoodsStore.add({ id: 0, emoji: '😡' });
        objectMoodsStore.add({ id: 1, emoji: '😭' });
        objectMoodsStore.add({ id: 2, emoji: '🙁' });
        objectMoodsStore.add({ id: 3, emoji: '😐' });
        objectMoodsStore.add({ id: 4, emoji: '🙂' });
        objectMoodsStore.add({ id: 5, emoji: '😁' });
      }
    };
  });
}

export async function clearIDB(): Promise<string> {
  let db: IDBDatabase = await getDb();
  return new Promise((resolve, reject) => {
    let trans: IDBTransaction = db.transaction(['moodRecords'], 'readwrite');
    trans.oncomplete = (e: Event) => {
      resolve('Cleared successfully');
    };
    trans.onerror = (e: Event) => {
      reject({ title: 'Error while cleaning', message: (e.target as IDBRequest).error });
    };

    let store: IDBObjectStore = trans.objectStore('moodRecords');
    store.clear();
  });
}

// RECORDS
export async function getDBMoodRecords(date_from?: string, date_to?: string): Promise<DBMoodRecord[]> {
  let db: IDBDatabase = await getDb();

  return new Promise((resolve, reject) => {
    let trans: IDBTransaction = db.transaction(['moodRecords'], 'readonly');
    trans.oncomplete = (e: Event) => {
      resolve(moodRecords.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())); //sort by date
    };
    trans.onerror = (e: Event) => {
      reject({ title: 'Error while fetching', message: (e.target as IDBRequest).error });
    };

    let store: IDBObjectStore = trans.objectStore('moodRecords');
    let moodRecords: DBMoodRecord[] = [];

    store.openCursor().onsuccess = (e: Event) => {
      let cursor = (e.target as IDBRequest).result as IDBCursorWithValue;
      if (cursor) {
        // date filter logic below
        if (date_from && date_to) {
          if (new Date(date_from).getTime() <= new Date(cursor.value.date).getTime() && new Date(cursor.value.date).getTime() <= new Date(date_to).getTime())
            moodRecords.push(cursor.value);
        } else if (date_from) {
          if (date_from && new Date(date_from).getTime() <= new Date(cursor.value.date).getTime()) moodRecords.push(cursor.value);
        } else if (date_to) {
          if (date_to && new Date(cursor.value.date).getTime() <= new Date(date_to).getTime()) moodRecords.push(cursor.value);
        } else moodRecords.push(cursor.value);
        cursor.continue();
      }
    };
  });
}

export async function saveDBMoodRecord(moodRecord: DBMoodRecord): Promise<string> {
  let db: IDBDatabase = await getDb();

  return new Promise((resolve, reject) => {
    let trans: IDBTransaction = db.transaction(['moodRecords'], 'readwrite');
    trans.oncomplete = (e: Event) => {
      resolve('Saved successfully');
    };
    trans.onerror = (e: Event) => {
      reject({ title: 'Error while creating', message: (e.target as IDBRequest).error });
    };

    let store: IDBObjectStore = trans.objectStore('moodRecords');
    store.put(moodRecord);
  });
}

export async function deleteDBMoodRecord(moodRecordId: DBMoodRecord['id']): Promise<string> {
  let db: IDBDatabase = await getDb();

  return new Promise((resolve, reject) => {
    let trans: IDBTransaction = db.transaction(['moodRecords'], 'readwrite');
    trans.oncomplete = (e: Event) => {
      resolve('Deleted successfully');
    };
    trans.onerror = (e: Event) => {
      reject({ title: 'Error while deleting', message: (e.target as IDBRequest).error });
    };

    let store: IDBObjectStore = trans.objectStore('moodRecords');
    store.delete(moodRecordId!);
  });
}

// MOODS
export async function getDBMoodsList(): Promise<DBMood[]> {
  let db: IDBDatabase = await getDb();

  return new Promise((resolve, reject) => {
    let trans: IDBTransaction = db.transaction(['moods'], 'readonly');
    trans.oncomplete = (e: Event) => {
      resolve(moods);
    };
    trans.onerror = (e: Event) => {
      reject({ title: 'Error while fetching', message: (e.target as IDBRequest).error });
    };

    let store: IDBObjectStore = trans.objectStore('moods');
    let moods: DBMood[] = [];

    store.openCursor().onsuccess = (e: Event) => {
      let cursor = (e.target as IDBRequest).result as IDBCursorWithValue;
      if (cursor) {
        moods.push(cursor.value);
        cursor.continue();
      }
    };
  });
}
