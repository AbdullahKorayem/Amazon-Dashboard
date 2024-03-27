import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Firestore, addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { environment } from 'src/app/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private baseUrl = '';

  constructor(private firestore:Firestore,private http: HttpClient) { }


  async getAllCategories(): Promise<any[]> {
    const querySnapshot = await getDocs(query(collection(this.firestore, 'Categories')));
    return querySnapshot.docs.map(Categories => Categories.data());
  }
  async getCategoryById(id: string): Promise<any[]> {
    const querySnapshot = await getDocs(query(collection(this.firestore, 'Categories')));
    return querySnapshot.docs.map(Categories => Categories.data());
  }



  async deleteCategoryByIdFirebase(id: string): Promise<void> {
    const categoryRef = doc(this.firestore, 'Categories', id);
    await deleteDoc(categoryRef);
  }

  async updateCategoryByIdFirebase(id: string, newData: any): Promise<void> {
    const categoryRef = doc(this.firestore, 'Categories', id);
    await updateDoc(categoryRef, newData);
  }








  // getAllCategories(): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.baseUrl}`);
  // }




  // getCategoryById(id: string): Observable<any> {
  //   return this.http.get<any>(`${this.baseUrl}/${id}`);
  // }

  createCategory(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, data);
  }

  updateCategoryById(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, data);
  }

  deleteCategoryById(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  deleteAllCategories(): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}`);
  }
  
}
