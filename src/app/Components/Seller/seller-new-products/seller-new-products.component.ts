import { Component, HostBinding, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { from } from 'rxjs';
import { CategoriesService } from 'src/app/Services/Categories-Service/categories.service';
import { DarkModeService } from 'src/app/Services/DarkMode/dark-mode-service.service';
import { ProductServiceService } from 'src/app/Services/Product-Service/product-service.service';


@Component({
  selector: 'app-seller-new-products',
  templateUrl: './seller-new-products.component.html',
  styleUrl: './seller-new-products.component.css'
})
export class SellerNewProductsComponent implements OnInit {
  public NewProductFormSeller!: FormGroup;
  public imageUrl: string = '';
  public categories: any[] = [];
  public thumbnail: string = '';
  @HostBinding('class.dark') isDarkMode: boolean = false;
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private catS: CategoriesService,
    private productService: ProductServiceService,
    private router: Router,
    private darkModeService: DarkModeService,
   

  ) {


  }


  ngOnInit(): void {

    this.darkModeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });

    let uid = sessionStorage.getItem('userUID');

    this.NewProductFormSeller = this.fb.group({
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
      thumbnail: this.thumbnail,
      SellerUid: uid,
    });


    from(this.catS.getAllCategories()).subscribe((res: any) => {
      this.categories = res;
    })

  }

  get arTitle() {
    return this.NewProductFormSeller.get('ar.title');
  }

  // Function to access the form control of en.title
  get enTitle() {
    return this.NewProductFormSeller.get('en.title');
  }

  public onSubmit() {
    console.log(this.NewProductFormSeller.value);
    this.NewProductFormSeller.value.thumbnail = this.thumbnail;   
    from(this.productService.addProduct(this.NewProductFormSeller.value)).subscribe(
      (response) => {
        this.toastr.success('Product added successfully');
        this.router.navigate(['/seller-productsS']);
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
        this.thumbnail = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  openImage() {
    const inputElement = document.getElementById('thumbnail');
    if (inputElement) {
      inputElement.click();
    }
  }
}
