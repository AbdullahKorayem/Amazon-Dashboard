import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, from } from 'rxjs';
import { CategoriesService } from 'src/app/Services/Categories-Service/categories.service';
import { SellersServiceService } from 'src/app/Services/Seller-Service/sellers-service.service';

@Component({
  selector: 'app-seller-products',
  templateUrl: './seller-products.component.html',
  styleUrl: './seller-products.component.css'
})
export class SellerProductsComponent {
  products$!: Observable<any[]>;
  categories: any[] = [];
  // robots: any;
  uid = sessionStorage.getItem('userUID')

  async readProducts() {
    this.products = await this.sellerService.getProductSeller(this.uid!);
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
    private route: ActivatedRoute,
    private catService: CategoriesService,
    private sellerService: SellersServiceService
  ) { }

  //routing
  navigateToProduct(product: string) {
    this.router.navigate(['/seller-productsS', product]);
  }

  Filterchange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value.trim().toLowerCase();
    this.dataSource.filter = value;
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

  getAllcategories(): void {
    from(this.catService.getAllCategories()).subscribe(
      (res: any[]) => {
        this.categories = res;
        console.log(this.categories);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }


  ngOnInit(): void {
    let uid = sessionStorage.getItem('userUID')

    this.getAllcategories();

    this.sellerService.getProductSeller(this.uid!).then(products => {
      console.log('Products:', products);
    }).catch(error => {
      console.error('Error fetching products:', error);
    });

    this.route.url.subscribe((urlSegments) => {

      const path = urlSegments.map((segment) => segment.path).join('/');
      this.currentRoutePath = path;

    });




    this.sellerService.getProductSeller(this.uid!).then(products => {
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
