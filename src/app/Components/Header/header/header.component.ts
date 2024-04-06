import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, from } from 'rxjs';
import { AuthState } from 'src/app/Services/Redux/Store/Admin.reducer';
import { SellersService } from 'src/app/Services/Users/sellers.service';
import { UsersService } from 'src/app/Services/Users/users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public errorMsg: any[] = [];
  public divTop = '-200px';
  public user$!: Observable<any>;
  public admin: any;

  constructor(private store: Store<{ auth: AuthState }>, private userService: UsersService, private sellerService: SellersService) { }

  togglePosition() {
    this.divTop = this.divTop === '-200px' ? '60px' : '-200px';
  }

  ngOnInit(): void {
    this.toGetTheUser();
  };

  toGetTheUser() {
    const uid = sessionStorage.getItem('userUID');
    if (uid) {
      let user$: Observable<any> = from(this.userService.getUserByUid(uid));
      user$.subscribe(
        (userRes: any) => {
          if (userRes && userRes.isAdmin === true) {
            this.admin = userRes;
          } else {
            from(this.sellerService.getSellerByUid(uid)).subscribe(
              (sellerRes: any) => {
                this.admin = sellerRes;
                console.log(this.admin);
              },
              (err: any) => {
                console.error(err);
              }
            );
          }
        },
        (err: any) => {
          console.error(err);
        }
      );
    }
  }

}
