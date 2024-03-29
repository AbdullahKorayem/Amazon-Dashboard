import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { CategoriesService } from 'src/app/Services/Categories-Service/categories.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  public myForm!: FormGroup;
  public editMode: boolean = false;
  public categories: any[] = [];
  private baseUrl = '';
  private editCat: any;
  public loading: boolean = false;
  public thumbnails: string = '';
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private catService: CategoriesService,
    private router: Router
  ) { }

  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.thumbnails = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  openImage() {
    const inputElement = document.getElementById('thumbnails');
    if (inputElement) {
      inputElement.click();
    }
  }
  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      header: ['', Validators.required],
      description: ['', Validators.required],
      name: ['', Validators.required],
      thumbnails: [''],
    });

    this.getAllcategories();
  }



  getAllcategories(): void {
    from(this.catService.getAllCategories()).subscribe(
      (res: any[]) => {
        this.categories = res;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }



  onSubmit() {

    console.log(this.myForm.value);
    if (this.myForm.valid) {
      if (this.editMode) {
        const updatedData = {
          header: this.myForm.value.header,
          description: this.myForm.value.description,
          name: this.myForm.value.name,
          thumbnails: this.thumbnails,
        };

        from(this.catService.updateCategoryByIdFirebase(this.editCat.id, updatedData)).subscribe(
          (data) => {
            console.log(data);
            this.editMode = false;
            this.getAllcategories();
          },
          (error) => {
            console.error(error);
          }
        );
      } else {
        this.loading = true;

        console.log(this.myForm.value);
        const cat = {
          name: this.myForm.value.header,
          description: this.myForm.value.description,
          thumbnails: this.thumbnails,
        };
        from(this.catService.addCategories(cat)).subscribe(
          (data) => {
            console.log(data);
            this.loading = false;
            this.getAllcategories();
            this.myForm.reset();
            this.thumbnails = "";
          },
          (error) => {
            console.error(error);
            this.loading = false;
          }
        );
      }
    }
  }

  public delete(id: string) {
    from(this.catService.deleteCategoryByIdFirebase(id)).subscribe(
      (data) => {
        console.log(data);
        this.getAllcategories();
      },
      (error) => {
        console.error(error);
      }
    );

  }

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

  public formatReadableDate(dateString: any) {
    const options: any = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };

    const date = new Date(dateString);

    return date.toLocaleString('en-US', options);
  }

  public navigateTo(id: string) {

    this.router.navigate(['customers', id]);

  }


  // getAllcategories() {
  //   this.catService.getAllCategories().subscribe(
  //     (data: any[]) => {
  //       this.categories = data;
  //     },
  //     (error) => {
  //       console.error(error);
  //     }
  //   );
  // }


  // getAllcategories() {
  //   this.catService.getAllCategories().then(categories => {
  //     this.categories = categories;
  //     console.log(this.categories);
  //   },).catch(error => {
  //     console.error('Error fetching categories:', error);
  //   });
  // }

  public update(id: string) {
    this.editMode = true;
    from(this.catService.getCategoryById(id)).subscribe(
      (data: any) => {
        this.editCat = data;
        this.myForm.patchValue({
          header: this.editCat.name,
          description: this.editCat.description,
          name: this.editCat.name,
          thumbnails: this.editCat.thumbnails
        });

      },
      (error) => {
        console.error(error);
      }
    );
  }

}
