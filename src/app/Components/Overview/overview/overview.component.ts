import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriesService } from 'src/app/Services/Categories-Service/categories.service';
import { CostumersService } from 'src/app/Services/Customers-Service/costumers.service';
import { OrdersService } from 'src/app/Services/Orders-Service/orders.service';
import { ProductServiceService } from 'src/app/Services/Product-Service/product-service.service';

import { Chart } from 'chart.js/auto';
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  chart: any = [];
  doughnutChart: any = []; 
  public product: any[] = [];

  public orders: any;

  public Costumers: any[] = [];

  public Totalamount: number = 0;

  public nbOrders: number = 0;

  public errorMsg: any[] = [];

  public cats: any[] = [];

  // public tags: any[] = [];

  // public comments: any[] = [];

  constructor(
    private productService: ProductServiceService,
    private orderS: OrdersService,
    private costumerS: CostumersService,
    private http: HttpClient,
    private router: Router,
    private catS: CategoriesService,

  ) { }

  LastOrders: string[] = [
    "ID",
    "Name",
    "Date",
    "Tracking",
    "Amount"
  ];



 



  ngOnInit(): void {

    // this.fetchProducts();

    this.fetchCostumers();

    this.fetchOrders();

    // this.fetchCats();

    // this.fetchCats();

    // Chart


    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
          {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            borderWidth: 1,
          },
          {
            label: '# of Votes',
            data: [1, 2, 3, 9, 7, 3],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });4

    //  Dought Chart

    this.doughnutChart = new Chart('canvas2', {
      type: 'doughnut',
      data: {
        labels: [
          'Red',
          'Blue',
          'Yellow'
        ],
        datasets: [{
          label: 'My First Dataset',
          data: [300, 50, 100],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
          hoverOffset: 4
        }]
      },
      options: {
        // You can add additional options here if needed
      }
    });



  }



  //fetch acts
  // public fetchCats() {
  //   this.catS.getAllCategories().subscribe(
  //     (data: any[]) => {
  //       this.cats = data;
  //     },
  //     (error) => {
  //       console.error(error);
  //     }
  //   );
  // }



  //fetch prods
  // public fetchProducts() {
  //   this.productService.getProducts().subscribe(res => {

  //     this.product = res.data;

  //   })
  // }

  //fetch costumers
  public fetchCostumers() {
    this.costumerS.getCostumer().subscribe((res: any) => {
      this.Costumers = res.customers;
    }, (err: any) => {
      console.log(err);

    })
  }

  //fetch orders
  public fetchOrders() {
    this.orderS.getOrders().subscribe(
      (res) => {
        this.orders = res;
        console.log(res);

        this.Totalamount = this.calculateTotalAmountWithStatusTrue(this.orders.orders);
        this.nbOrders = this.getOrderLength(this.orders.orders);

      },
      (error) => {
        console.error('Error fetching orders:', error);
      }
    );
  }

  //routing
  navigateToProduct(productId: string) {
    this.router.navigate(['/products', productId]);
  }

  //deleting a product by id
  // public deleteProductById(id: string) {
  //   this.productService.deleteProductById(id).subscribe(
  //     (res) => {

  //       console.log(res);
  //       this.fetchProducts();

  //     },
  //     (err) => {
  //       console.log(err);


  //     }
  //   );

  //   this.product = this.productService.getProducts()
  //   //.subscribe(res => {

  //   //   this.product = res.data;

  //   // })
  // }

  //date formateur
  public formatReadableDate(dateString: any) {
    const options: any = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };

    const date = new Date(dateString);

    return date.toLocaleString('en-US', options);
  }


  //get order length
  public getOrderLength(orders: any[]): number {
    return orders.length;
  }

  //calculate the amount of an activates orders
  public calculateTotalAmountWithStatusTrue(orders: any[]): number {
    let totalAmount = 0;
    for (const order of orders) {

      if (order.status === true) {
        totalAmount += order.totalAmount;
      }

    }
    return totalAmount;
  }

  //toogle the activate button and the status attribut in order scheme
  public toggleOrderStatusById(id: string) {

    const orderToUpdate = this.orders.orders.find((order: any) => order._id === id);

    if (orderToUpdate) {

      const currentStatus = orderToUpdate.status;
      const newStatus = !currentStatus;

      this.orderS?.updateOrderStatusById(id, newStatus).subscribe(
        (res) => {

          console.log(res);
          orderToUpdate.status = newStatus;
          this.fetchOrders();

        },
        (err) => {

          console.log(err);

        }
      );
    }
  }

  public deleteOrderById(id: string) {

    this.orderS.deleteOrderById(id).subscribe(
      (res) => {

        console.log(res);

        this.orders.orders = this.orders.orders.filter((order: any) => order._id !== id);
        this.updateProductQuantities(res, false);
        this.fetchOrders();

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

  //delete cosutmer by id and also delete the related orders 
  public deleteCostumer(id: string) {
    this.costumerS.deleteCostumerById(id).subscribe(
      (res: any) => {

        this.fetchCostumers();

      }, (err: any) => {

        console.log(err);


      }
    )
  }



  //delete a category by id
  public deleteCat(id: string) {
    this.catS.deleteCategoryById(id).subscribe(
      (data) => {

        console.log(data);
        // this.fetchCats();

      },
      (error) => {
        console.error(error);
      }
    );
  }
}
