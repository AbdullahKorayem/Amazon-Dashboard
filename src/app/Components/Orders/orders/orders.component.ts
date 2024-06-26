import { Component, HostBinding, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrdersService } from 'src/app/Services/Orders-Service/orders.service';
import { ProductServiceService } from 'src/app/Services/Product-Service/product-service.service';
import { from } from 'rxjs';
import { DarkModeService } from 'src/app/Services/DarkMode/dark-mode-service.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: any;
  FirebaseOrders: any;
  statusOrder: boolean = false;
  selectedValue: string = 'Pending';
  @HostBinding('class.dark') isDarkMode: boolean = false;
  constructor(
    private http: HttpClient,
    private orderService: OrdersService,
    private productS: ProductServiceService,
    private darkModeService: DarkModeService

  ) { };
  ngOnInit(): void {

    this.darkModeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });

    this.getOrdersData();


  }



  getOrdersData(): void {
    from(this.orderService.getAllOrdersFirebase()).subscribe(
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
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value;
    this.orderService.updateOrderByIdFirebase(id, selectedValue)
    this.getOrdersData();
  }


  public formatReadableDate(dateString: any) {

    const options: any = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };

    const date = new Date(dateString);

    return date.toLocaleString('en-US', options);
  }










  //---------------------------------------------------------------RedLine------------------- 



  selectedOrder: any;

  showProductDetails(index: number): void {
    this.selectedOrder = this.orders.orders[index];
  }

  closeProductModal(): void {
    this.selectedOrder = null;
  }


  public deleteAllOrders() {
    this.orderService.deleteAllOrders().subscribe(
      (res) => {
        console.log(res);


        // this.updateProductQuantitiesV2(res.deletedOrders,false);
        this.orders.orders = [];
      },
      (err) => {
        console.log(err);
      }
    );
  }
  private updateProductQuantitiesV2(orders: any[], status?: boolean) {
    orders.forEach((order: any) => {

      order.products.forEach((updatedProduct: any) => {

        const productId = updatedProduct.product;
        const allQte = parseInt(updatedProduct.product.quantity, 10);
        const subQuantity = parseInt(updatedProduct.quantity, 10);

        const newQuantity = status ? allQte - subQuantity : allQte + subQuantity;

        const updateUrl = `http://localhost:3000/api/v1/products/product/${productId}`;

        this.http.put(updateUrl, { quantity: newQuantity })
          .subscribe(
            (response) => {

              console.log(response);

            },
            (error) => {

              if (error.status === 404) {
                console.log('Product not found.');
              } else {
                console.error(error);
              }

            }
          );
      });
    });
  }



  public toggleOrderStatusById(id: string) {

    const orderToUpdate = this.orders.orders.find((order: any) => order._id === id);

    if (orderToUpdate) {
      const currentStatus = orderToUpdate.status;
      const newStatus = !currentStatus;

      this.orderService?.updateOrderStatusById(id, newStatus).subscribe(
        (res) => {
          console.log(res);
          orderToUpdate.status = newStatus;

        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  public deleteOrderById(id: string) {
    this.orderService.deleteOrderById(id).subscribe(
      (res) => {
        console.log(res);

        this.orders.orders = this.orders.orders.filter((order: any) => order._id !== id);
        this.updateProductQuantities(res, false);

      },
      (err) => {
        console.log(err);
      }
    );
  }
  //it works fine
  private updateProductQuantities(result: any, status?: boolean) {
    for (const updatedProduct of result.order.products) {

      const productId = updatedProduct.product._id;
      const allQuantity = parseInt(updatedProduct.product.quantity, 10);
      const subQuantity = parseInt(updatedProduct.quantity, 10);



      const newQuantity = status ? allQuantity - subQuantity : allQuantity + subQuantity;
      const updateUrl = `http://localhost:3000/api/v1/products/product/${productId}`;

      console.log(updatedProduct, newQuantity);


      this.http.put(updateUrl, { quantity: newQuantity })
        .subscribe(
          (response) => {

            console.log(response);

          },
          (error) => {

            if (error.status === 404) {
              console.log('Product not found.');
            } else {
              console.error(error);

            }

          }
        );
    }
  }
}
