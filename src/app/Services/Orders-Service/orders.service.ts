import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Firestore, addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where,onSnapshot } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private apiUrl = 'http://localhost:3000/api/v1/orders';

  constructor(private firestore: Firestore, private http: HttpClient) { }

  async getAllOrdersFirebase(): Promise<any[]> {
    try {
      const querySnapshot = await getDocs(query(collection(this.firestore, 'Orders')));
      return querySnapshot.docs.map(order => ({ id: order.id, ...order.data() }));
    } catch (error) {
      console.error('Error fetching all orders:', error);
      throw error;
    }
  }

  async getOrderByIdFirebase(id: string): Promise<any | null> {
    try {
      const orderRef = doc(this.firestore, 'Orders', id);
      const orderSnapshot = await getDoc(orderRef);

      if (orderSnapshot.exists()) {
        return { id: orderSnapshot.id, ...orderSnapshot.data() };
      } else {
        return null; // Order with given id not found
      }
    } catch (error) {
      console.error('Error fetching order by id:', error);
      throw error;
    }
  }

  async searchOrdersByFieldFirebase(field: string, value: any): Promise<any[]> {
    try {
      const ordersCollectionRef = collection(this.firestore, 'Orders');
      const querySnapshot = await getDocs(query(ordersCollectionRef, where(field, '==', value)));
      return querySnapshot.docs.map(order => ({ id: order.id, ...order.data() }));
    } catch (error) {
      console.error('Error searching orders by field:', error);
      throw error;
    }
  }

  async deleteOrderByIdFirebase(id: string): Promise<void> {
    try {
      const orderRef = doc(this.firestore, 'Orders', id);
      await deleteDoc(orderRef);
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  }

  async updateOrderByIdFirebase(id: string, selectedValue: string): Promise<void> {
    try {
      const orderRef = doc(this.firestore, 'Orders', id);

      // Update only the OrderStatus property
      await updateDoc(orderRef, {
        status: selectedValue
      });
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
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
