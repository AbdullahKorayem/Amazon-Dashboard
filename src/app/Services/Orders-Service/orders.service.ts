import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Firestore, addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private apiUrl = 'http://localhost:3000/api/v1/orders';

  constructor(private firestore: Firestore, private http: HttpClient) { }


  async getAllOrdersFirebase(): Promise<any[]> {
    const querySnapshot = await getDocs(query(collection(this.firestore, 'Order')));
    return querySnapshot.docs.map(Order => Order.data());
  }



  async getOrderByIdFirebase(id: string): Promise<any | null> {
    const OrderRef = doc(this.firestore, 'Order', id);
    const OrderSnapshot = await getDoc(OrderRef);

    if (OrderSnapshot.exists()) {
      return { id: OrderSnapshot.id, ...OrderSnapshot.data() };
    } else {
      return null; // Order with given id not found
    }
  }
  // Search in Orders
  async searchOrdersByFieldFirebase(field: string, value: any): Promise<any[]> {
    const ordersCollectionRef = collection(this.firestore, 'Orders');
    const querySnapshot = await getDocs(query(ordersCollectionRef, where(field, '==', value)));
    return querySnapshot.docs.map(order => ({ id: order.id, ...order.data() }));
  }


  async deleteOrderByIdFirebase(id: string): Promise<void> {
    const OrderRef = doc(this.firestore, 'Order', id);
    await deleteDoc(OrderRef);
  }

  async updateOrderByIdFirebase(id: string, newData: any): Promise<void> {
    const orderRef = doc(this.firestore, 'Order', id);
    await updateDoc(orderRef, newData);
  }


















  public getOrders(): Observable<any> {
    return this.http.get(this.apiUrl);

  }



  public postProduct(productData: any): Observable<any> {
    return this.http.post(this.apiUrl, JSON.stringify(productData));
  }

  public getOrderById(id: string) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Delete a specific order by ID
  public deleteOrderById(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Delete all orders
  public deleteAllOrders(): Observable<any> {
    return this.http.delete(this.apiUrl);
  }

  public updateOrderStatusById(id: string, newStatus: boolean) {
    const data = { status: newStatus };


    const url = `${this.apiUrl}/${id}`;

    return this.http.put(url, data);
  }

}
