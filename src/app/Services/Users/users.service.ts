import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, query, setDoc, doc, getDoc } from '@angular/fire/firestore';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth'; // Import createUserWithEmailAndPassword
import { signInWithEmailAndPassword } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) { }

  async getAdmins(): Promise<any[]> {
    const querySnapshot = await getDocs(query(collection(this.firestore, 'Admins')));
    const Admins = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return { id: doc.id, ...data };
    });
    return Admins;
  }

  async createUser(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      console.log('Admins created successfully:', userCredential.user);
      return userCredential.user;
    } catch (error) {
      console.error('Error creating Admins:', error);
      throw error;
    }
  }

  async SignInWithE_P(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);

      return userCredential.user;
    } catch (error) {
      console.error('Error creating Admin:', error);
      throw error;
    }

  }

  async getUserByUid(uid: string): Promise<any | null> {
    try {
      const docRef = doc(this.firestore, 'Admins', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {

        return { uid: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching Admin by UID:', error);
      throw error; // Propagate the error to the caller
    }
  }



}
