// import { Injectable } from '@angular/core';
// import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
// import { UsersService } from '../Services/Users/users.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {

//   constructor(private userService: UsersService, private router: Router) { }

//   async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {  
//     const userUID = sessionStorage.getItem('userUID');

//     if (userUID) {
//       try {
        
//         const user = await this.userService.getUserByUid(userUID);
//         console.log(user);
//         return user.isAdmin === true;
//       } catch (error) {
//         console.error('Error retrieving user:', error);
//         return false;
//       }
//     } else {
//       console.error('User UID not found in session storage');
//       this.router.navigate(['/login']); 
//       return false;
//     }
//   }
// }
// ----------------------------================================---------------------------------
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { UsersService } from '../Services/Users/users.service';
import { SellersService } from '../Services/Users/sellers.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private userService: UsersService,
    private sellersService: SellersService, // Inject SellersService
    private router: Router
  ) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    const userUID = sessionStorage.getItem('userUID');

    if (userUID) {
      try {
        const user = await this.userService.getUserByUid(userUID);

        // Check for admin users
        if (user && user.isAdmin === true) {
          // console.log(user);
          return true; // Allow access for admins
        }

        // Check for seller users (assuming SellersService exists)
        const seller = await this.sellersService.getSellerByUid(userUID);
        if (seller) {
          // console.log(seller);
          return seller.isAdmin === false; // Allow non-admin sellers
        }

        // If no valid user or seller found, redirect to login
        console.error('Invalid user or seller data for UID:', userUID);
        return this.router.parseUrl('/login');
      } catch (error) {
        console.error('Error retrieving user or seller data:', error);
        return this.router.parseUrl('/login'); // Redirect on error
      }
    } else {
      console.error('User UID not found in session storage');
      return this.router.parseUrl('/login'); // Redirect if no UID
    }
  }
}


