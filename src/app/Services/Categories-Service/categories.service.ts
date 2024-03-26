import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Firestore, addDoc, collection, getDocs, query } from '@angular/fire/firestore';
import { environment } from 'src/app/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private baseUrl = '';

  constructor(private firestore:Firestore,private http: HttpClient) { }

  // getAllCategories(): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.baseUrl}`);
  // }

  async getAllCategories(): Promise<any[]> {
    const querySnapshot = await getDocs(query(collection(this.firestore, 'Categories')));
    return querySnapshot.docs.map(Categories => Categories.data());
  }
  async getCategoryById(id: string): Promise<any[]> {
    const querySnapshot = await getDocs(query(collection(this.firestore, 'Categories')));
    return querySnapshot.docs.map(Categories => Categories.data());
  }
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
