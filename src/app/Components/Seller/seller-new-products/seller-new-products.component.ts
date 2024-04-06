import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { from } from 'rxjs';
import { CategoriesService } from 'src/app/Services/Categories-Service/categories.service';
import { ProductServiceService } from 'src/app/Services/Product-Service/product-service.service';

@Component({
  selector: 'app-seller-new-products',
  templateUrl: './seller-new-products.component.html',
  styleUrl: './seller-new-products.component.css'
})
export class SellerNewProductsComponent implements OnInit {
  public NewProductForm!: FormGroup;
  public imageUrl: string = '';
  public categories: any[] = [];
  public thumbnail: string = '';
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private catS: CategoriesService,
    private productService: ProductServiceService,
    private router: Router
  ) {


  }

  ngOnInit(): void {
    let uid = sessionStorage.getItem('userUID');

    this.NewProductForm = this.fb.group({
      ar: this.fb.group({
        brand: [''],
        description: ['', Validators.required],
        title: [''],
      }),
      en: this.fb.group({
        brand: [''],
        description: ['', Validators.required],
        title: [''],
      }),
      images: [],
      price: ['', Validators.required],
      quantityInStock: ['', Validators.required],
      rating: 5 | 0,
      ratingQuantity: 10 | 0,
      sku: ['ssg', Validators.required],
      sold: null,
      subCategoryId: ['', Validators.required],
      thumbnail: '',
      SellerUid: uid,
    });


    from(this.catS.getAllCategories()).subscribe((res: any) => {
      this.categories = res;
    })

  }

  get arTitle() {
    return this.NewProductForm.get('ar.title');
  }

  // Function to access the form control of en.title
  get enTitle() {
    return this.NewProductForm.get('en.title');
  }

  public onSubmit() {
    console.log(this.NewProductForm.value);
    from(this.productService.addProduct(this.NewProductForm.value)).subscribe(
      (response) => {
        this.toastr.success('Product added successfully');
        this.router.navigate(['/products']);
      },
      (error) => {
        console.error('Error:', error);
        this.toastr.error('Failed to add product');
      }
    );
  }

  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageUrl = reader.result as string;
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
