import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showHeader: boolean = true;
  showSidebar: boolean = true;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Check the current route to determine whether to show header and sidebar
        const currentRoute = this.router.url.split('/')[1]; // Extract the first segment after the leading slash
        this.showHeader = !['login', 'toRegister'].includes(currentRoute);
        this.showSidebar = !['login', 'toRegister'].includes(currentRoute);
      }
    });
  }
}
