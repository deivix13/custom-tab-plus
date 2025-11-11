import { imageData } from "../types/image";
const DB_NAME = 'MyDatabase';
const DB_VERSION = 1;
const STORE_NAME = 'dataStore';

let db: IDBDatabase | null = null;


let dbPromise: Promise<IDBDatabase> | null = null;

async function getDB(): Promise<IDBDatabase> {
  if (db) return db;
  if (!dbPromise) {
    dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onerror = () => reject(new Error("Error opening IndexedDB"));
      request.onupgradeneeded = (event) => {
        const database = (event.target as IDBOpenDBRequest).result;
        if (!database.objectStoreNames.contains(STORE_NAME)) {
          database.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        }
      };
      request.onsuccess = () => {
        db = request.result;
        resolve(db);
      };
    });
  }
  return dbPromise;
}


export async function saveData(data: imageData[]): Promise<void> {
    const database = await getDB();

    return new Promise((resolve, reject) => {
        const tx = database.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);

        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(new Error("Error saving data to IndexedDB"));

        for (const element of data) {
            store.put(element);
        }
    });
}

export async function getData<T = imageData>(key: string): Promise<T | null> {
    const database = await getDB();

    return new Promise((resolve, reject) => {
        const tx = database.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const request = store.get(key);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(new Error("Error getting data from IndexedDB"));
    });
}

export async function getAllData(): Promise<imageData[]> {
    const database = await getDB();

    return new Promise((resolve, reject) => {
        const tx = database.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(new Error("Error getting all data from IndexedDB"));

    });
}

export async function deleteData(key: string): Promise<void> {
    const database = await getDB();

    return new Promise((resolve, reject) => {
        const tx = database.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const request = store.delete(key);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(new Error("Error deleting data from IndexedDB"));
    });
}

export async function getRandomData(): Promise<imageData | null> {
    const allData = await getAllData();
    if (allData.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * allData.length);
    return allData[randomIndex];
}
