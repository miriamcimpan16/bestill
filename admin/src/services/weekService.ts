import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Week, Day } from '../types';

export const weekService = {
  // Salvează săptămâna și zilele ca subcollection
  async saveWeek(weekData: Omit<Week, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const weekId = `week_${weekData.weekStart}`;
    const weekRef = doc(db, 'weeks', weekId);
    
    const now = new Date().toISOString();
    
    // Salvează documentul săptămânii (fără array de zile)
    await setDoc(weekRef, {
      weekStart: weekData.weekStart,
      weekEnd: weekData.weekEnd,
      status: weekData.status,
      createdAt: now,
      updatedAt: now
    }, { merge: true });
    
    // Salvează fiecare zi ca document în subcollection
    const daysCollection = collection(weekRef, 'days');
    
    for (const day of weekData.days) {
      const dayId = `day_${day.dayOfWeek}`;
      const dayRef = doc(daysCollection, dayId);
      
      await setDoc(dayRef, {
        dayOfWeek: day.dayOfWeek,
        date: day.date,
        verseReference: day.verseReference,
        verseText: day.verseText,
        title: day.title,
        content: day.content,
        reflectionQuestion: day.reflectionQuestion,
        order: day.order
      });
    }
    
    return weekId;
  },

  // Obține o săptămână cu toate zilele ei
  async getWeek(weekId: string): Promise<Week | null> {
    const weekRef = doc(db, 'weeks', weekId);
    const weekSnap = await getDoc(weekRef);
    
    if (!weekSnap.exists()) {
      return null;
    }
    
    const weekData = weekSnap.data();
    
    // Obține zilele din subcollection
    const daysCollection = collection(weekRef, 'days');
    const daysQuery = query(daysCollection, orderBy('dayOfWeek'));
    const daysSnap = await getDocs(daysQuery);
    
    const days: Day[] = [];
    daysSnap.forEach((doc) => {
      days.push(doc.data() as Day);
    });
    
    return {
      id: weekSnap.id,
      weekStart: weekData.weekStart,
      weekEnd: weekData.weekEnd,
      status: weekData.status,
      days: days,
      createdAt: weekData.createdAt,
      updatedAt: weekData.updatedAt
    };
  },

  // Obține toate săptămânile
  async getAllWeeks(): Promise<Week[]> {
    const weeksRef = collection(db, 'weeks');
    const weeksQuery = query(weeksRef, orderBy('weekStart', 'desc'));
    const weeksSnap = await getDocs(weeksQuery);
    
    const weeks: Week[] = [];
    
    for (const weekDoc of weeksSnap.docs) {
      const weekData = weekDoc.data();
      
      // Obține zilele pentru fiecare săptămână
      const daysCollection = collection(weekDoc.ref, 'days');
      const daysQuery = query(daysCollection, orderBy('dayOfWeek'));
      const daysSnap = await getDocs(daysQuery);
      
      const days: Day[] = [];
      daysSnap.forEach((dayDoc) => {
        days.push(dayDoc.data() as Day);
      });
      
      weeks.push({
        id: weekDoc.id,
        weekStart: weekData.weekStart,
        weekEnd: weekData.weekEnd,
        status: weekData.status,
        days: days,
        createdAt: weekData.createdAt,
        updatedAt: weekData.updatedAt
      });
    }
    
    return weeks;
  }
};
