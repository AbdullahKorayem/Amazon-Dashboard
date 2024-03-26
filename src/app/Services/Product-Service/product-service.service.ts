import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { throwError } from 'rxjs'; // Import throwError
import { Firestore, addDoc, collection, getDocs, query } from '@angular/fire/firestore';
import { environment } from 'src/app/environment';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {


  private apiUrl = 'https://fakestoreapi.com/products?limit=5';
  
  private productsCollection: AngularFirestoreCollection<any>;

  constructor(private firestore:AngularFirestore,private http: HttpClient) {
    this.productsCollection = this.firestore.collection<any>('products');
   }

  async getProducts(): Promise<any[]> {
    const querySnapshot = await getDocs(query(collection(this.firestore, 'Product')));
    return querySnapshot.docs.map(Product => Product.data());
  }

  getFirebaseConfig() {
    return environment.firebase; // Return Firebase config
  }


  getProductsFromFirestore(): Observable<any[]> {
    return this.productsCollection.valueChanges();
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
