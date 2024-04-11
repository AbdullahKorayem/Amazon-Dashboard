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
  theAdmins: any;
  userUid: any = sessionStorage.getItem('userUID');
  public currentPath: string | undefined;
  activeItem: string | null = null;
  public sidebarisOpen: boolean = true;
  links: any;

  constructor(
    private router: Router,
    private user: UsersService,
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
    from(this.user.getUserByUid(this.userUid)).subscribe(
      (res: any) => {
        this.theAdmins = res;

        // Check if user is admin and set links accordingly
        if (this.theAdmins.isAdmin === true) {
          this.links = [
            {
              title: 'Dashboard',
              items: [
                { name: 'overview', icon: 'fa-solid fa-house' },
                { name: 'products', icon: 'fa-solid fa-bag-shopping' },
                { name: 'orders', icon: 'fa-solid fa-cart-shopping' },
                { name: 'categories', icon: 'fa-solid fa-dumpster-fire' },
                { name: 'customers', icon: 'fa-solid fa-users' }
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
                { name: 'seller-productsS', icon: 'fa-solid fa-bag-shopping' },
                { name: 'seller-ordersS', icon: 'fa-solid fa-cart-shopping' },
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
    this.activeItem = itemName;
  }

  // Navigate to specified route
  public navigateTo(item: string): void {
    this.router.navigate(['/', item]);
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
