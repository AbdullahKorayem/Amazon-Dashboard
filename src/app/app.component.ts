import { Component, HostBinding, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DarkModeService } from './Services/DarkMode/dark-mode-service.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  // darkMode=signal<boolean>(false);
  @HostBinding('class.dark') isDarkMode: boolean = false;
  showHeader: boolean = true;
  showSidebar: boolean = true;



  constructor(private router: Router, private darkModeService: DarkModeService ,private translateService: TranslateService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Check the current route to determine whether to show header and sidebar
        const currentRoute = this.router.url.split('/')[1]; // Extract the first segment after the leading slash
        this.showHeader = !['login', 'toRegister'].includes(currentRoute);
        this.showSidebar = !['login', 'toRegister'].includes(currentRoute);
      }
    });

    const userLang=navigator.language || 'en';
    const languageCode =userLang.split('-')[0];
    this.translateService.setDefaultLang(languageCode);
    this.translateService.use(languageCode);
  }



  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.darkModeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }
  // toggleDarkMode(isDark: boolean): void {
  //   this.darkModeService.toggleDarkMode(isDark);
  // }
}

