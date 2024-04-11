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
      const querySnapshot = await getDocs(query(collection(this.firestore, 'Orders')));
      return querySnapshot.docs.map(order => ({ id: order.id, ...order.data() }));
    } catch (error) {
      console.error('Error fetching all orders:', error);
      throw error;
    }
  }

  async updateOrderByIdFirebase(id: string, selectedValue: string): Promise<void> {
    try {
      const orderRef = doc(this.firestore, 'Orders', id);

      // Check if the document exists before updating
      const docSnapshot = await getDoc(orderRef);
      if (!docSnapshot.exists()) {
        console.error('Document does not exist:', id);
        return; // Exit function if document doesn't exist
      }

      // Update only the status property
      await updateDoc(orderRef, {
        status: selectedValue
      });
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }





  async getSellerByUid(uid: string): Promise<any | null> {
    try {
      const docRef = doc(this.firestore, 'Sellers', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {

        return { uid: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching Admin by UID:', error);
      throw error; // Propagate the error to the caller
    }
  }





}
