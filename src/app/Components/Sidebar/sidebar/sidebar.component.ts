import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  public links: any = [
    {
      title: 'Dashboard',
      items: [
        {
          name: 'overview',
          icon: 'fa-solid fa-house',
         },
         {
          name: 'products',
          icon: 'fa-solid fa-bag-shopping',
        }, {
          name: 'orders',
          icon: 'fa-solid fa-cart-shopping',
        },
        {
          name: 'categories',
          icon: 'fa-solid fa-dumpster-fire',
        },
        {
          name: 'customers',
          icon: 'fa-solid fa-users',
        }
        
      ],
    }
  ]

  activeItem: string | null = null; // Property to keep track of the active item

  // Function to set the active item
  setActiveItem(itemName: string): void {
    this.activeItem = itemName;
  }
//date formateur
public formatReadableDate(dateString: any) {
  const options: any = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };

  const date = new Date(dateString);

  return date.toLocaleString('en-US', options);
}


//price formatteur
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


// [routerLink]="['/', item.name]
public currentPath: string | undefined;

public navigateTo(item: string) {

  this.router.navigate(['/', item]);

}

constructor(
  private router: Router
) {
  this.router.events.subscribe((event) => {

    if (event instanceof NavigationEnd) {

      this.currentPath = event.url.slice(1);

    }
  });
}

public sidebarisOpen: boolean = true;

public toggleSideBar() {

  this.sidebarisOpen = false;
  console.log(this.sidebarisOpen);

}
}
