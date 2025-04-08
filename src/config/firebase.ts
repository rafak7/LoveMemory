import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, where, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDZTjGufSM-kX3Fr6GhXehPHm8Ij_5qPtE",
  authDomain: "lovememory-b0f91.firebaseapp.com",
  projectId: "lovememory-b0f91",
  storageBucket: "lovememory-b0f91.appspot.com",
  messagingSenderId: "1098832525871",
  appId: "1:1098832525871:web:c0e3c7e0c6d306c0c8f121"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export interface Memory {
  id?: string;
  title: string;
  description: string;
  date: string;
  userId: string;
  createdAt: number;
  musicUrl?: string;
  musicData?: any;
  photoUrls?: string[]; // URLs das fotos armazenadas
}

const memoriesApi = {
  create: async (memory: Memory) => {
    const docRef = await addDoc(collection(db, 'memories'), memory);
    return { ...memory, id: docRef.id };
  },

  getByUserId: async (userId: string) => {
    const q = query(collection(db, 'memories'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  },

  delete: async (id: string) => {
    await deleteDoc(doc(db, 'memories', id));
  },

  update: async (id: string, data: Partial<Memory>) => {
    await updateDoc(doc(db, 'memories', id), data);
  },

  // Funções para manipular imagens no Storage
  uploadPhoto: async (file: File, memoryId: string, index: number): Promise<string> => {
    const fileRef = ref(storage, `memories/${memoryId}/photo-${index}`);
    await uploadBytes(fileRef, file);
    return getDownloadURL(fileRef);
  },
};

export { memoriesApi }; 