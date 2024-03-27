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
    const querySnapshot = await getDocs(query(collection(this.firestore, 'Users')));
    return querySnapshot.docs.map(Users => Users.data());
  }
  async getUserByIdFirebase(id: string): Promise<any | null> {
    const UserRef = doc(this.firestore, 'Users', id);
    const UserSnapshot = await getDoc(UserRef);

    if (UserSnapshot.exists()) {
      return { id: UserSnapshot.id, ...UserSnapshot.data() };
    } else {
      return null;
    }
  }

  async deleteUserByIdFirebase(id: string): Promise<void> {
    const categoryRef = doc(this.firestore, 'Users', id);
    await deleteDoc(categoryRef);
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
