import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class SellersServiceService {

  constructor(private firestore: Firestore) { }




  async getProductSeller(uid: string): Promise<any[]> {
    const querySnapshot = await getDocs(query(collection(this.firestore, 'Products'), where('SellerUid', '==', uid)));
    const products = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return { id: doc.id, ...data };
    });
    return products;
  }

  async getAllOrdersSeller(uid: string): Promise<any[]> {
    try {
      const querySnapshot = await getDocs(query(collection(this.firestore, 'Orders'), where('uid', '==', uid)));
      return querySnapshot.docs.map(order => ({ id: order.id, ...order.data() }));
    } catch (error) {
      console.error('Error fetching orders for uid:', uid, error);
      throw error;
    }
  }

  async updateOrderByIdFirebase(id: string, selectedValue: string): Promise<void> {
    try {
      const orderRef = doc(this.firestore, 'Orders', id);

      // Update only the status property
      await updateDoc(orderRef, {
        status: selectedValue
      });
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }




}
