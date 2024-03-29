import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Firestore, addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class CostumersService {


  private apiUrl = 'http://localhost:3000/api/v1/customers/';

  constructor(private firestore: Firestore, private http: HttpClient) { }


  async getAllUsersFirebase(): Promise<any[]> {
    try {
      const querySnapshot = await getDocs(query(collection(this.firestore, 'Users')));
      return querySnapshot.docs.map(user => ({ id: user.id, ...user.data() }));
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  }

  async getUserByIdFirebase(id: string): Promise<any | null> {
    try {
      const userRef = doc(this.firestore, 'Users', id);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        return { id: userSnapshot.id, ...userSnapshot.data() };
      } else {
        return null; // User with given id not found
      }
    } catch (error) {
      console.error('Error fetching user by id:', error);
      throw error;
    }
  }

  async deleteUserByIdFirebase(id: string): Promise<void> {
    try {
      const userRef = doc(this.firestore, 'Users', id);
      await deleteDoc(userRef);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }















// ----------------


  public getCostumer(): Observable<any> {
    return this.http.get(this.apiUrl);
    
  }
  
  public getCostumerByID(id:string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
    
  }

  public deleteCostumerById(id:string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
    
  }

}
