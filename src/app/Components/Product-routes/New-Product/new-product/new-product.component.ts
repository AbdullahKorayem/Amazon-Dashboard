import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostBinding, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CategoriesService } from 'src/app/Services/Categories-Service/categories.service';
import { ActivatedRoute, Router } from '@angular/router';
import { from } from 'rxjs';
import { ProductServiceService } from 'src/app/Services/Product-Service/product-service.service';
import { DarkModeService } from 'src/app/Services/DarkMode/dark-mode-service.service';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent implements OnInit {
  public NewProductForm!: FormGroup;
  // public ARProductForm: FormGroup;
  // public ENProductForm: FormGroup;

  
  public categories: any[] = [];
  public thumbnail: string = '';
  @HostBinding('class.dark') isDarkMode: boolean = false;


  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private Ar: FormBuilder,
    private En: FormBuilder,
    private arForm: FormBuilder,
    private toastr: ToastrService,
    private catS: CategoriesService,
    private productService: ProductServiceService,
    private router: Router,
    private darkModeService: DarkModeService,
    private cdr: ChangeDetectorRef 
  ) {


  }

  ngOnInit(): void {

    this.darkModeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });


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
      thumbnail: this.thumbnail,
    });


    from(this.catS.getAllCategories()).subscribe((res: any) => {
      this.categories = res;
    })

  }

  get arTitle() {
    return this.NewProductForm.get('ar.title');
  }

  get enTitle() {
    return this.NewProductForm.get('en.title');
  }

  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log(reader.result);
        this.thumbnail = e.target?.result as string;
        console.log(this.thumbnail);
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  public onSubmit() {
    console.log(this.NewProductForm.value);
    this.NewProductForm.value.thumbnail = this.thumbnail;
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

  openImage() {
    const inputElement = document.getElementById('thumbnail');
    if (inputElement) {
      inputElement.click();
    }
  }


}
