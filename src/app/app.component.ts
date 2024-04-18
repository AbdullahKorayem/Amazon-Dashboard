import { Component, HostBinding, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DarkModeService } from './Services/DarkMode/dark-mode-service.service';
import { TranslateService } from '@ngx-translate/core';
import { Direction } from '@angular/cdk/bidi';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @HostBinding('class.dark') isDarkMode: boolean = false;
  @HostBinding('attr.dir') dirAttribute: Direction = 'ltr';
  showHeader: boolean = true;
  showSidebar: boolean = true;

  constructor(
    private router: Router,
    private darkModeService: DarkModeService,
    private translateService: TranslateService
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentRoute = this.router.url.split('/')[1];
        this.showHeader = !['login', 'toRegister'].includes(currentRoute);
        this.showSidebar = !['login', 'toRegister'].includes(currentRoute);
      }
    });

    // Subscribe to language change events
    this.translateService.onLangChange.subscribe(event => {
      const languageCode = event.lang.split('-')[0];
      // Determine the directionality based on language
      this.dirAttribute = languageCode === 'ar' ? 'rtl' : 'ltr';
    });

    // Initialize default language
    const userLang = navigator.language || 'en';
    const languageCode = userLang.split('-')[0];
    this.translateService.setDefaultLang(languageCode);
    this.translateService.use(languageCode);

    // Determine the directionality based on language
    this.dirAttribute = languageCode === 'ar' ? 'rtl' : 'ltr';

    // Subscribe to dark mode changes
    this.darkModeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

}
