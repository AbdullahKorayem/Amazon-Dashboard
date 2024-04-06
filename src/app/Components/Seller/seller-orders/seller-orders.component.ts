import { Component } from '@angular/core';
import { from } from 'rxjs';
import { SellersServiceService } from 'src/app/Services/Seller-Service/sellers-service.service';


@Component({
  selector: 'app-seller-orders',
  templateUrl: './seller-orders.component.html',
  styleUrl: './seller-orders.component.css'
})
export class SellerOrdersComponent {
  orders: any;
  FirebaseOrders: any;
  statusOrder: boolean = false;
  selectedValue: string = 'Pending';
  constructor(
    private sellerService: SellersServiceService
  ) { };
  ngOnInit(): void {

    let uid = sessionStorage.getItem('userUID');

    this.getOrdersData(uid!);


  }


  selectedOrder: any;

  showProductDetails(index: number): void {
    this.selectedOrder = this.orders.orders[index];
  }

  closeProductModal(): void {
    this.selectedOrder = null;
  }

  public formatReadableDate(dateString: any) {

    const options: any = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };

    const date = new Date(dateString);

    return date.toLocaleString('en-US', options);
  }


  getOrdersData(uid: string): void {
    from(this.sellerService.getAllOrdersSeller(uid)).subscribe(
      (res: any[]) => {
        this.FirebaseOrders = res;
        console.log(this.FirebaseOrders);

      },
      (err: any) => {
        console.log(err);
      }
    );
  }





  onSelectChange(event: Event, id: string) {
    let uid=sessionStorage.getItem('userUID');
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value;
    this.sellerService.updateOrderByIdFirebase(id, selectedValue)
    this.getOrdersData(uid!);
  }






}
