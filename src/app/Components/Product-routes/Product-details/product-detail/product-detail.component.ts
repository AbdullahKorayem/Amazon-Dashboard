import { HttpClient } from '@angular/common/http';
import { Component, HostBinding, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from 'src/app/Services/Categories-Service/categories.service';
import { ProductServiceService } from 'src/app/Services/Product-Service/product-service.service';
import { ToasterService } from '@coreui/angular';
import { from } from 'rxjs';
import { DarkModeService } from 'src/app/Services/DarkMode/dark-mode-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-product-detail',
	templateUrl: './product-detail.component.html',
	styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
	public product: any;
	public productForm: FormGroup;
	public thumbnail: string = '';
	public loading: boolean = false;

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
			rating: [5], // Set default rating (optional)
			ratingQuantity: [10], // Set default ratingQuantity (optional)
			sku: ['ssg', Validators.required],
			sold: [null], // Initialize sold control with null
			subCategoryId: ['', Validators.required],
			thumbnail: '',})}
	
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
				console.log(res);
				this.toastr.success('The Product Deleted Successfully');
				this.router.navigate(['/products']);
			},
			(err) => {
				this.toastr.error('Operation Failed');
				console.log(err);
			}
		);
	}
	public onSubmit(){
		console.log(this.productForm.value)
	}

	public editProduct(productId: string) {
		from(this.productService.updateProductByIdFirebase(productId, this.productForm.value)).subscribe(
			(res) => {
				this.toastr.success('The Product Updated Successfully');
				console.log(res);
				this.router.navigate(['/products']);
			},
			(err) => {
				this.toastr.error('Operation Failed');
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

// import { HttpClient } from '@angular/common/http';
// import { Component, OnInit } from '@angular/core';
// import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import { CategoriesService } from 'src/app/Services/Categories-Service/categories.service';
// import { ProductServiceService } from 'src/app/Services/Product-Service/product-service.service';
// import { ToasterService } from '@coreui/angular';
// import { from } from 'rxjs';

// @Component({
// 	selector: 'app-product-detail',
// 	templateUrl: './product-detail.component.html',
// 	styleUrls: ['./product-detail.component.css']
// })
// export class ProductDetailComponent implements OnInit {
// 	public product: any;

// 	public productForm: FormGroup;

// 	public imageUrl: string = '';

// 	public isopen: boolean = true;

// 	public loading: boolean = false;

// 	private apiUrl = 'http://localhost:3000/api/v1/products/product';

// 	public categories: any[] = [];

// 	public tags: any[] = [];

// 	constructor(
// 		private productService: ProductServiceService,
// 		private route: ActivatedRoute,
// 		private fb: FormBuilder,
// 		private router: Router,
// 		private http: HttpClient,
// 		private toastService: ToasterService,
// 		private catS: CategoriesService,
// 	) {

// 		this.productForm = this.fb.group({
// 			name: ['', Validators.required],
// 			price: ['', Validators.required],
// 			image: [''],
// 			description: ['', Validators.required],
// 			category: ['', Validators.required],
// 			quantity: ['', Validators.required],

// 		});

// 	}

// 	ngOnInit() {

// 		this.route.paramMap.subscribe(params => {

// 			const productId = params.get('id');

// 				from(this.productService.getProductByIdFirebase(productId)).subscribe(
// 					(res) => {
// 						this.product = res.data;
// 					},
// 					(err) => {
// 						console.log(err);
// 					}
// 				);

// 				this.productService.getProductById(productId).subscribe(

// 					(product) => {
// 						this.product = product.data;

// 						// Update form values with the current product data
// 						this.productForm.patchValue({
// 							title: this.product.title,
// 							price: this.product.price,
// 							thumbnail: this.product.thumbnail,
// 							description: this.product.description,
// 							category: this.product.category,
// 							discount: this.product.discount,
// 							quantity: this.product.quantity,

// 						});

// 						this.imageUrl = this.product.thumbnail;

// 					},
// 					(error) => {

// 						console.log(error);

// 					}
// 				);
// 			}
// 		});
// 	}

// 	//delete a product by id
// 	public deleteProduct(id: string) {
// 		from(this.productService.deleteProductByIdFirebase(this.product.id)).subscribe(
// 		(res) => {
// 			console.log(res);
// 			this.router.navigate(['/products']);
// 		},
// 		(err) => {
// 			console.log(err);
// 		}
// 	)

// 	}

// 	onSubmit() {
// 		this.loading = true;
// 		if (this.productForm.valid) {

// 			this.productForm.value['image'] = this.imageUrl;

// 			this.http.put(`${this.apiUrl}/${this.product._id}`, { ...this.productForm.value, updateDate: new Date() }).subscribe(
// 				(res) => {
// 					console.log(res);

// 					this.productForm.reset();
// 					this.router.navigate(['/products']);

// 				},
// 				(err) => {

// 					console.log(err);

// 				}
// 			);
// 		}
// 	}
// 	public formatReadableDate(dateString: any) {
// 		const options: any = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };

// 		const date = new Date(dateString);

// 		return date.toLocaleString('en-US', options);

// 	}

// 	public formatPrice(price: any) {
// 		if (typeof price === 'string') {

// 			if (price.includes('$')) {

// 				return price.replace('$', '') + '$';
// 			} else {

// 				return price + '$';
// 			}
// 		} else if (typeof price === 'number') {

// 			return price.toString() + '$';
// 		} else {

// 			return 'N/A';
// 		}
// 	}

// }
