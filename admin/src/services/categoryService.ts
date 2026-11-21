import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc,
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { OpenWhenCategory, OpenWhenVerse } from '../types';

export const categoryService = {
  // Salvează/actualizează o categorie
  async saveCategory(categoryData: Omit<OpenWhenCategory, 'createdAt' | 'updatedAt'>): Promise<string> {
    const categoryRef = doc(db, 'openWhenCategories', categoryData.id);
    
    const now = new Date().toISOString();
    
    // Verifică dacă categoria există deja
    const existingDoc = await getDoc(categoryRef);
    const createdAt = existingDoc.exists() ? existingDoc.data().createdAt : now;
    
    // Salvează documentul categoriei (fără array de versete)
    await setDoc(categoryRef, {
      title: categoryData.title,
      createdAt: createdAt,
      updatedAt: now
    });
    
    return categoryData.id;
  },

  // Adaugă un verset într-o categorie
  async addVerse(categoryId: string, verse: Omit<OpenWhenVerse, 'id'>): Promise<string> {
    const categoryRef = doc(db, 'openWhenCategories', categoryId);
    const versesCollection = collection(categoryRef, 'verses');
    
    const verseId = `verse_${Date.now()}`;
    const verseRef = doc(versesCollection, verseId);
    
    await setDoc(verseRef, {
      verseReference: verse.verseReference,
      verseText: verse.verseText,
      order: verse.order
    });
    
    // Actualizează updatedAt pentru categorie
    await setDoc(categoryRef, {
      updatedAt: new Date().toISOString()
    }, { merge: true });
    
    return verseId;
  },

  // Șterge un verset dintr-o categorie
  async deleteVerse(categoryId: string, verseId: string): Promise<void> {
    const categoryRef = doc(db, 'openWhenCategories', categoryId);
    const verseRef = doc(categoryRef, 'verses', verseId);
    
    await deleteDoc(verseRef);
    
    // Actualizează updatedAt pentru categorie
    await setDoc(categoryRef, {
      updatedAt: new Date().toISOString()
    }, { merge: true });
  },

  // Obține o categorie cu toate versetele ei
  async getCategory(categoryId: string): Promise<OpenWhenCategory | null> {
    const categoryRef = doc(db, 'openWhenCategories', categoryId);
    const categorySnap = await getDoc(categoryRef);
    
    if (!categorySnap.exists()) {
      return null;
    }
    
    const categoryData = categorySnap.data();
    
    // Obține versetele din subcollection
    const versesCollection = collection(categoryRef, 'verses');
    const versesQuery = query(versesCollection, orderBy('order'));
    const versesSnap = await getDocs(versesQuery);
    
    const verses: OpenWhenVerse[] = [];
    versesSnap.forEach((doc) => {
      verses.push({
        id: doc.id,
        ...doc.data()
      } as OpenWhenVerse);
    });
    
    return {
      id: categorySnap.id,
      title: categoryData.title,
      verses: verses,
      createdAt: categoryData.createdAt,
      updatedAt: categoryData.updatedAt
    };
  },

  // Obține toate categoriile
  async getAllCategories(): Promise<OpenWhenCategory[]> {
    const categoriesRef = collection(db, 'openWhenCategories');
    const categoriesQuery = query(categoriesRef, orderBy('title'));
    const categoriesSnap = await getDocs(categoriesQuery);
    
    const categories: OpenWhenCategory[] = [];
    
    for (const categoryDoc of categoriesSnap.docs) {
      const categoryData = categoryDoc.data();
      
      // Obține versetele pentru fiecare categorie
      const versesCollection = collection(categoryDoc.ref, 'verses');
      const versesQuery = query(versesCollection, orderBy('order'));
      const versesSnap = await getDocs(versesQuery);
      
      const verses: OpenWhenVerse[] = [];
      versesSnap.forEach((verseDoc) => {
        verses.push({
          id: verseDoc.id,
          ...verseDoc.data()
        } as OpenWhenVerse);
      });
      
      categories.push({
        id: categoryDoc.id,
        title: categoryData.title,
        verses: verses,
        createdAt: categoryData.createdAt,
        updatedAt: categoryData.updatedAt
      });
    }
    
    return categories;
  },

  // Șterge o categorie întreagă
  async deleteCategory(categoryId: string): Promise<void> {
    const categoryRef = doc(db, 'openWhenCategories', categoryId);
    
    // Șterge toate versetele din subcollection
    const versesCollection = collection(categoryRef, 'verses');
    const versesSnap = await getDocs(versesCollection);
    
    const deletePromises = versesSnap.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    // Șterge categoria
    await deleteDoc(categoryRef);
  }
};
