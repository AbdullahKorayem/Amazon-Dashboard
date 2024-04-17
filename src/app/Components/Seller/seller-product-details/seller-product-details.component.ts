import { Component, HostBinding } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { from } from 'rxjs';
import { CategoriesService } from 'src/app/Services/Categories-Service/categories.service';
import { DarkModeService } from 'src/app/Services/DarkMode/dark-mode-service.service';
import { ProductServiceService } from 'src/app/Services/Product-Service/product-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-seller-product-details',

  templateUrl: './seller-product-details.component.html',
  styleUrl: './seller-product-details.component.css'
})
export class SellerProductDetailsComponent {
  public product: any;
  public productForm: FormGroup;
  public thumbnail: string = '';
  public loading: boolean = false;
  uid = sessionStorage.getItem('userUID');
  @HostBinding('class.dark') isDarkMode: boolean = false;

  constructor(
    private productService: ProductServiceService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private catS: CategoriesService,
    private darkModeService: DarkModeService,
    private toastr: ToastrService,
  ) {
    this.productForm = this.fb.group({
      ar: this.fb.group({
        brand: ['', Validators.required],
        description: ['', Validators.required],
        title: ['', Validators.required],
      }),
      en: this.fb.group({
        brand: ['', Validators.required],
        description: ['', Validators.required],
        title: ['', Validators.required],
      }),
      images: [],
      price: ['', Validators.required],
      quantityInStock: ['', Validators.required],
      rating: [5],
      ratingQuantity: [10],
      sku: ['ssg', Validators.required],
      sold: [null],
      subCategoryId: ['', Validators.required],
      thumbnail: '',
      SellerUid: this.uid,

    })
  }

  categories: any[] = [];

  ngOnInit() {

    this.darkModeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });

    this.route.paramMap.subscribe((params) => {
      const productId = params.get('id');
      console.log(productId);
      if (productId) {
        from(this.productService.getProductByIdFirebase(productId)).subscribe(
          (res) => {
            this.product = res;
            this.productForm.patchValue({
              ar: {
                brand: this.product.ar.brand,
                description: this.product.ar.description,
                title: this.product.ar.title,
              },
              en: {
                brand: this.product.en.brand,
                description: this.product.en.description,
                title: this.product.en.title,
              },
              images: this.product.images,
              price: this.product.price,
              quantityInStock: this.product.quantityInStock,
              rating: this.product.rating,
              ratingQuantity: this.product.ratingQuantity,
              sku: this.product.sku,
              sold: this.product.sold,
              subCategoryId: this.product.subCategoryId,
              thumbnail: this.product.thumbnail,
              SellerUid: this.product.SellerUid,
            });
          },
          (err) => {
            console.log(err);
          }
        );
      }
    });

    this.getCategories();
  }

  public getCategories() {
    from(this.catS.getAllCategories()).subscribe(
      (res) => {
        this.categories = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  public deleteProduct(id: string) {
    from(this.productService.deleteProductByIdFirebase(id)).subscribe(
      (res) => {
        this.toastr.success('The Product Deleted Successfully');
        this.router.navigate(['/seller-productsS']);
      },
      (err) => {
        this.toastr.error('The Operation Failed', err);
        console.log(err);
      }
    );
  }
  public onSubmit() {
    console.log(this.productForm.value)
  }

  public editProduct(productId: string) {
    from(this.productService.updateProductByIdFirebase(productId, this.productForm.value)).subscribe(
      (res) => {
        console.log(res);
        this.toastr.success('The Product Updated Successfully');
        this.router.navigate(['/seller-productsS']);
      },
      (err) => {
        this.toastr.error('The Operation Failed', err);
        console.log(err);
      }
    )
  }

  onImageChange(event: any) {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        this.thumbnail = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  openImage() {
    const inputElement = document.getElementById('image');
    if (inputElement) {
      inputElement.click();
    }
  }
}
