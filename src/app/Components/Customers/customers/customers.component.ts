import { HttpClient } from '@angular/common/http';
import { Component, HostBinding, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { CostumersService } from 'src/app/Services/Customers-Service/costumers.service';
import { DarkModeService } from 'src/app/Services/DarkMode/dark-mode-service.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  public result: any[] = [];
  public FirebaseUsers: any = [];

  constructor(
    private router: Router,
    private costumersService: CostumersService,
    private http: HttpClient,
    private darkModeService: DarkModeService,
    private toastr: ToastrService,
    
  ) { }
  @HostBinding('class.dark') isDarkMode: boolean = false;

  ngOnInit(): void {
    this.getAllUsers();

    this.darkModeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });

  }

 

  getAllUsers(): void {
    from(this.costumersService.getAllUsersFirebase()).subscribe(
      (res: any[]) => {
        this.FirebaseUsers = res;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  deleteUser(id: string) {
    from(this.costumersService.deleteUserByIdFirebase(id)).subscribe(
      (res: any) => {
        this.toastr.success('User Deleted!');
        console.log(res);
        this.getAllUsers();
      },
      (err: any) => {
        this.toastr.error('Operation Failed!');
        console.log(err);
      }
      
    )
  }








  // -----------------------------------------------------------RedLine--------------------

  // this.costumers.getCostumer().subscribe(
  //   (res: any) => {

  //     console.log(res);
  //     this.result = res.customers;

  //   }, (err) => {
  //     console.log(err);
  //   }
  // )
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

}
