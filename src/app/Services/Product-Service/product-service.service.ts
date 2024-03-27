import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { throwError } from 'rxjs'; // Import throwError
import { Firestore, addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc } from '@angular/fire/firestore';
import { environment } from 'src/app/environment';


@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {


  private apiUrl = 'https://fakestoreapi.com/products?limit=5';
  
  // 
  constructor(private firestore:Firestore,private http: HttpClient) { }

  async getProducts(): Promise<any[]> {
    const querySnapshot = await getDocs(query(collection(this.firestore, 'Products')));
    const products = querySnapshot.docs.map(Product => Product.data());
    return products;
  }

 
  async getProductByIdFirebase(id: string): Promise<any | null> {
    const productRef = doc(this.firestore, 'Products', id);
    const productSnapshot = await getDoc(productRef);

    if (productSnapshot.exists()) {
      return { id: productSnapshot.id, ...productSnapshot.data() };
    } else {
      return null; // Product with given id not found
    }
  }

  async deleteProductByIdFirebase(id: string): Promise<void> {
    const productRef = doc(this.firestore, 'Products', id);
    await deleteDoc(productRef);
  }

  async updateProductByIdFirebase(id: string, newData: any): Promise<void> {
    const productRef = doc(this.firestore, 'Products', id);
    await updateDoc(productRef, newData);
  }








  getFirebaseConfig() {
    return environment.firebase; // Return Firebase config
  }


  
  // async getProducts() {
  //   return (
  //    await getDocs(query(collection(this.firestore, 'Product')))
  //   ).docs.map((Product) => Product.data());
  //   console.log(this.firestore)
  //}

  // async public getProduct(): Observable<any> {
  //   return (
  //     await getDocs(query(collection(this.firestore, 'robots')))
  //    ).docs.map((robots) => robots.data());
  // }
  
  // public getProducts(): Observable<any> {
  //   return this.http.get(this.apiUrl);
    
  // }

  public postProduct(productData: any): Observable<any> {
    return this.http.post(this.apiUrl, JSON.stringify(productData));
  }

  public deleteAllProducts(): Observable<any> {
    return this.http.delete(this.apiUrl);
  }

  public updateProductById(productId: string, productData: any): Observable<any> {
    const updateUrl = `${this.apiUrl}/product/${productId}`;
    return this.http.patch(updateUrl, productData);
  }

  public deleteProductById(productId: string): Observable<any> {
    const deleteUrl = `${this.apiUrl}/product/${productId}`;
    return this.http.delete(deleteUrl);
  }

  public getProductById(productId: string): Observable<any> {
    const getUrl = `${this.apiUrl}/product/${productId}`;
    return this.http.get(getUrl);
  }


}
