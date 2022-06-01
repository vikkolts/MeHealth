import type { DBMoodRecord, MoodRecord } from '@/stores/moodTypes';

const DB_NAME: string = 'me-health-db';
const DB_VERSION: number = 1;
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
      let objectStore: IDBObjectStore = db.createObjectStore('moodRecords', { autoIncrement: true, keyPath: 'id' });
      objectStore.createIndex('date', 'date', { unique: true });
      objectStore.createIndex('mood_id', 'mood_id', { unique: false });
      objectStore.createIndex('notes', 'notes', { unique: false });
    };
  });
}
export async function deleteDBMoodRecord(moodRecordId: DBMoodRecord['id']): Promise<String> {
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
    store.delete(moodRecordId);
  });
}
export async function getDBMoodRecords(): Promise<DBMoodRecord[]> {
  let db: IDBDatabase = await getDb();

  return new Promise((resolve, reject) => {
    let trans: IDBTransaction = db.transaction(['moodRecords'], 'readonly');
    trans.oncomplete = (e: Event) => {
      resolve(moodRecords);
    };
    trans.onerror = (e: Event) => {
      reject({ title: 'Error while fetching', message: (e.target as IDBRequest).error });
    };

    let store: IDBObjectStore = trans.objectStore('moodRecords');
    let moodRecords: DBMoodRecord[] = [];

    store.openCursor().onsuccess = (e: Event) => {
      let cursor = (e.target as IDBRequest).result;
      if (cursor) {
        moodRecords.push(cursor.value);
        cursor.continue();
      }
    };
  });
}

export async function saveDBMoodRecord(moodRecord: MoodRecord): Promise<String> {
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
