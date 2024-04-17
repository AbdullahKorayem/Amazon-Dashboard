import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { from } from 'rxjs';
import { SellersServiceService } from 'src/app/Services/Seller-Service/sellers-service.service';
import { UsersService } from 'src/app/Services/Users/users.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  theUser: any;
  userUid: any = sessionStorage.getItem('userUID');
  public currentPath: string | undefined;
  public sidebarisOpen: boolean = true;
  public links: any;
  theAdmins: any;

  constructor(
    private router: Router,
    private userService: UsersService,
    private sellerService: SellersServiceService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentPath = event.url.slice(1);
      }
    });
  }

  ngOnInit(): void {
    this.toGetUser();
  }

  toGetUser() {
    from(this.userService.getUserByUid(this.userUid)).subscribe(
      (res: any) => {
        this.theAdmins = res;

        // Check if user is admin and set links accordingly
        if (this.theAdmins.isAdmin === true) {
          this.links = [
            {
              title: 'Dashboard',
              items: [
                { title: 'Overview', icon: 'fa-solid fa-house', path: 'overview' },
                { title: 'Products', icon: 'fa-solid fa-bag-shopping', path: 'products' },
                { title: 'Orders', icon: 'fa-solid fa-cart-shopping', path: 'orders' },
                { title: 'Categories', icon: 'fa-solid fa-dumpster-fire', path: 'categories' },
                { title: 'Customers', icon: 'fa-solid fa-users', path: 'customers' }
              ]
            }
          ];
        }
      },
      error => {
        console.error('Error retrieving user:', error);
      }
    );

    from(this.sellerService.getSellerByUid(this.userUid)).subscribe(
      (res: any) => {
        this.theAdmins = res;
        if (this.theAdmins.isAdmin === false) {
          this.links = [
            {
              title: 'Dashboard',
              items: [
                { title: 'Products', icon: 'fa-solid fa-bag-shopping', path: 'seller-productsS' },
                { title: 'Orders', icon: 'fa-solid fa-cart-shopping', path: 'seller-ordersS' },
              ]
            }
          ];
        }
      },
      error => {
        console.error('Error retrieving seller:', error);
      }
    );
  }

  // Function to set the active item
  setActiveItem(itemName: string): void {
    this.currentPath = itemName;
  }

  // Navigate to specified route
  public navigateTo(path: string): void {
    this.router.navigate(['/', path]);
  }

  // Toggle sidebar visibility
  public toggleSideBar(): void {
    this.sidebarisOpen = !this.sidebarisOpen;
  }

  // Logout user
  public logOut(): void {
    localStorage.removeItem('userUID');
    this.router.navigate(['login']);
  }
}
