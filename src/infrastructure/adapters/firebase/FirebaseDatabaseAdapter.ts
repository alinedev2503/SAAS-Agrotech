import { IDatabaseService } from '../../../domain/interfaces/IDatabaseService';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where 
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let db: any;
if (import.meta.env.VITE_BAAS_PROVIDER === 'firebase' && firebaseConfig.projectId) {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
}

// In-memory / localStorage fallback when Firestore is unconfigured
const LOCAL_STORAGE_PREFIX = 'agrotech_db_';
const mockSubscriptions: Map<string, Array<(data: any[]) => void>> = new Map();

const initialDemoData: Record<string, any[]> = {
  lots: [
    { id: 'lot-1', name: 'Lote Confinamento A', species: 'bovino', quantity: 45 },
    { id: 'lot-2', name: 'Lote Piquete Leiteiro', species: 'bovino', quantity: 28 },
    { id: 'lot-3', name: 'Lote Recria Nelore', species: 'bovino', quantity: 60 }
  ],
  animals: [
    { id: 'anim-1', tag: 'BR-1001', name: 'Estrela', species: 'bovino', breed: 'Nelore', birth_date: '2023-04-12', weight: 485, status: 'ativo', lot_id: 'lot-1' },
    { id: 'anim-2', tag: 'BR-1002', name: 'Barão', species: 'bovino', breed: 'Angus', birth_date: '2023-06-20', weight: 510, status: 'ativo', lot_id: 'lot-1' },
    { id: 'anim-3', tag: 'BR-1003', name: 'Mimosa', species: 'bovino', breed: 'Girolando', birth_date: '2022-11-05', weight: 460, status: 'quarentena', lot_id: 'lot-2' },
    { id: 'anim-4', tag: 'BR-1004', name: 'Soberano', species: 'bovino', breed: 'Brahman', birth_date: '2023-01-15', weight: 540, status: 'tratamento', lot_id: 'lot-3' }
  ]
};

function getLocalCollection<T>(collectionName: string): T[] {
  const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${collectionName}`);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // Fallback to default
    }
  }
  const defaultItems = (initialDemoData[collectionName] || []) as T[];
  localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${collectionName}`, JSON.stringify(defaultItems));
  return defaultItems;
}

function saveLocalCollection<T>(collectionName: string, items: T[]) {
  localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${collectionName}`, JSON.stringify(items));
  const callbacks = mockSubscriptions.get(collectionName);
  if (callbacks) {
    callbacks.forEach(cb => cb(items));
  }
}

export class FirebaseDatabaseAdapter implements IDatabaseService {
  
  async get<T>(collectionName: string, id: string): Promise<T | null> {
    if (db) {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      }
      return null;
    }
    const items = getLocalCollection<any>(collectionName);
    const item = items.find(i => i.id === id);
    return item ? (item as T) : null;
  }

  async list<T>(collectionName: string, filters?: any): Promise<T[]> {
    if (db) {
      const colRef = collection(db, collectionName);
      let q = query(colRef);
      if (filters) {
        const conditions = Object.entries(filters).map(([key, value]) => where(key, '==', value));
        q = query(colRef, ...conditions);
      }
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
    }

    let items = getLocalCollection<any>(collectionName);
    if (filters) {
      items = items.filter(item => {
        return Object.entries(filters).every(([k, v]) => item[k] === v);
      });
    }
    return items as T[];
  }

  async create<T>(collectionName: string, data: Partial<T>): Promise<T> {
    if (db) {
      const colRef = collection(db, collectionName);
      const docRef = await addDoc(colRef, data as any);
      return { id: docRef.id, ...data } as T;
    }

    const items = getLocalCollection<any>(collectionName);
    const newItem = {
      id: `${collectionName.slice(0, 4)}-${Date.now()}`,
      ...data,
    };
    items.push(newItem);
    saveLocalCollection(collectionName, items);
    return newItem as T;
  }

  async update<T>(collectionName: string, id: string, data: Partial<T>): Promise<T> {
    if (db) {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, data as any);
      return { id, ...data } as T;
    }

    const items = getLocalCollection<any>(collectionName);
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...data };
      saveLocalCollection(collectionName, items);
      return items[index] as T;
    }
    return { id, ...data } as T;
  }

  async delete(collectionName: string, id: string): Promise<void> {
    if (db) {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      return;
    }

    const items = getLocalCollection<any>(collectionName);
    const filtered = items.filter(item => item.id !== id);
    saveLocalCollection(collectionName, filtered);
  }

  subscribe<T>(collectionName: string, callback: (data: T[]) => void, filters?: any): () => void {
    if (db) {
      const colRef = collection(db, collectionName);
      let q = query(colRef);
      
      if (filters) {
        const conditions = Object.entries(filters).map(([key, value]) => where(key, '==', value));
        q = query(colRef, ...conditions);
      }

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
        callback(items);
      });

      return unsubscribe;
    }

    if (!mockSubscriptions.has(collectionName)) {
      mockSubscriptions.set(collectionName, []);
    }
    const list = mockSubscriptions.get(collectionName)!;
    list.push(callback);

    // Initial callback
    this.list<T>(collectionName, filters).then(callback);

    return () => {
      const idx = list.indexOf(callback);
      if (idx !== -1) list.splice(idx, 1);
    };
  }
}
