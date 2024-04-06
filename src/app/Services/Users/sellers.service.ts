import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, query, setDoc, doc, getDoc } from '@angular/fire/firestore';
import { Auth} from '@angular/fire/auth'; 


@Injectable({
    providedIn: 'root'
})
export class SellersService {

    constructor(
        private firestore: Firestore,
        private auth: Auth
    ) { }

    async getSellers(): Promise<any[]> {
        const querySnapshot = await getDocs(query(collection(this.firestore, 'Sellers')));
        const Admins = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return { id: doc.id, ...data };
        });
        return Admins;
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
            console.error('Error fetching Sellers by UID:', error);
            throw error; 
        }
    }

  

}
