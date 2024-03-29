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
    try {
      const querySnapshot = await getDocs(query(collection(this.firestore, 'Categories')));
      return querySnapshot.docs.map(category => ({ id: category.id, ...category.data() }));
    } catch (error) {
      console.error('Error fetching all categories:', error);
      throw error;
    }
  }

  async getCategoryById(id: string): Promise<any | null> {
    try {
      const categoryRef = doc(this.firestore, 'Categories', id);
      const categorySnapshot = await getDoc(categoryRef);

      if (categorySnapshot.exists()) {
        return { id: categorySnapshot.id, ...categorySnapshot.data() };
      } else {
        return null; // Category with given id not found
      }
    } catch (error) {
      console.error('Error fetching category by id:', error);
      throw error;
    }
  }

  async addCategories(newCategoryData: any): Promise<void> {
    try {
      const CategoryCollectionRef = collection(this.firestore, 'Categories');
      await addDoc(CategoryCollectionRef, newCategoryData);
    } catch (error) {
      console.error('Error adding category:', error);
      throw error; 
    }
  }


  async deleteCategoryByIdFirebase(id: string): Promise<void> {
    try {
      const categoryRef = doc(this.firestore, 'Categories', id);
      await deleteDoc(categoryRef);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }

  async updateCategoryByIdFirebase(id: string, newData: any): Promise<void> {
    try {
      const categoryRef = doc(this.firestore, 'Categories', id);
      await updateDoc(categoryRef, newData);
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  


  // getAllCategories(): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.baseUrl}`);
  // }




  // getCategoryById(id: string): Observable<any> {
  //   return this.http.get<any>(`${this.baseUrl}/${id}`);
  // }

  // createCategory(data: any): Observable<any> {
  //   return this.http.post<any>(`${this.baseUrl}`, data);
  // }

  // updateCategoryById(id: string, data: any): Observable<any> {
  //   return this.http.put<any>(`${this.baseUrl}/${id}`, data);
  // }

  // deleteCategoryById(id: string): Observable<any> {
  //   return this.http.delete<any>(`${this.baseUrl}/${id}`);
  // }

  // deleteAllCategories(): Observable<any> {
  //   return this.http.delete<any>(`${this.baseUrl}`);
  // }
  
}
