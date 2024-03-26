import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductServiceService } from 'src/app/Services/Product-Service/product-service.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products$!: Observable<any[]>;
  // robots: any;

  async readProducts() {
    this.products = await this.productService.getProducts();
    console.log(this.products);
  }
  
  displayedColumns: string[] = [
    '_id',
    'image',
    'name',
    // 'description',
    'price',
    // 'discount',
    'category',
    // 'tag',
    'quantity',
    // 'firstDate',
    // 'updateDate',
  ];

  products: any[] = [];

  currentRoutePath: string = '';

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private productService: ProductServiceService,
    private route: ActivatedRoute
  ) { }

  //routing
  navigateToProduct(productId: string) {
    this.router.navigate(['/products', productId]);
  }

  Filterchange(event: Event) {

    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();

  }

  public formatReadableDate(dateString: any) {

    const options: any = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };

    const date = new Date(dateString);

    return date.toLocaleString('en-US', options);

  }
  compareDates(updatedDate: Date, firstDate: Date): string {

    return updatedDate === firstDate ? 'text-black' : 'font-medium text-green-600';

  }

  //price formatteur
  public formatPrice(price: any) {
    if (typeof price === 'string') {

      if (price.includes('$')) {

        return price.replace('$', '') + '$';
      } else {

        return price + '$';
      }
    } else if (typeof price === 'number') {

      return price.toString() + '$';
    } else {

      return 'N/A';
    }
  }

  


  ngOnInit(): void {
    // const firebaseConfig = this.productService.getFirebaseConfig();
    // console.log(firebaseConfig);

    // console.log(this.readProducts)

    this.productService.getProducts().then(products => {
      console.log('Products:', products);
    }).catch(error => {
      console.error('Error fetching products:', error);
    });

    this.route.url.subscribe((urlSegments) => {

      const path = urlSegments.map((segment) => segment.path).join('/');
      this.currentRoutePath = path;

    });

    // this.productService.getProducts().subscribe(
    //   (res) => {

    //     console.log(res);

    //     this.products = res.data;

    //     this.dataSource.data = this.products;

    //     this.dataSource.paginator = this.paginator;

    //     this.dataSource.sort = this.sort;

    //   },
    //   (err) => {
    //     console.error(err);
    //   }
    // );


    this.productService.getProducts().then(products => {
      console.log('Products:', products);
      console.log(products);
  
      this.products = products;

      this.dataSource.data = this.products;

      this.dataSource.paginator = this.paginator;

      this.dataSource.sort = this.sort;
    }).catch(error => {
      console.error('Error fetching products:', error);
    });
  }
}
