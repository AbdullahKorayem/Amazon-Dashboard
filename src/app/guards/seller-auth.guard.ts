import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { UsersService } from '../Services/Users/users.service';
import { SellersService } from '../Services/Users/sellers.service';

@Injectable({
  providedIn: 'root'
})
export class SellerAuthGuard implements CanActivate {

  constructor(
    private userService: UsersService,
    private sellersService: SellersService,
    private router: Router
  ) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    const userUID = sessionStorage.getItem('userUID');

    if (userUID) {
      try {
        const user = await this.userService.getUserByUid(userUID);

        // Check if user is a seller
        const seller = await this.sellersService.getSellerByUid(userUID);
        if (seller) {
          // Allow access only to seller-related routes
          if (state.url.includes('productsS') || state.url.includes('ordersS') || state.url.includes('new')) {
            return true;
          } else {
            console.error('Seller does not have access to this route:', state.url);
            return this.router.parseUrl('/login');
          }
        }

        // If not a seller, redirect to login
        console.error('User is not a seller');
        return this.router.parseUrl('/login');
      } catch (error) {
        console.error('Error retrieving seller data:', error);
        return this.router.parseUrl('/login');
      }
    } else {
      console.error('User UID not found in session storage');
      return this.router.parseUrl('/login');
    }
  }
}
