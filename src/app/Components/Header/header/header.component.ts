import { Component, HostBinding, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, from } from 'rxjs';
import { DarkModeService } from 'src/app/Services/DarkMode/dark-mode-service.service';
import { AuthState } from 'src/app/Services/Redux/Store/Admin.reducer';
import { SellersService } from 'src/app/Services/Users/sellers.service';
import { UsersService } from 'src/app/Services/Users/users.service';
import { TranslateService } from '@ngx-translate/core';
import { Direction } from '@angular/cdk/bidi';

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

  public moonImgSrc = "assets/moon.svg";
  public sunImgSrc = "assets/sun.svg";
  selectedLanguage: string = 'en';
  supportedLanguages = [
    { name: 'English', code: 'en' },
    { name: 'Arabic', code: 'ar' },
    // Add more languages as needed
  ];

  @HostBinding('attr.dir') dirAttribute: Direction = 'ltr';

  @HostBinding('class.dark') isDarkMode: boolean = false;


  toggleTheme() {
    this.darkModeService.toggleDarkMode(!this.isDarkMode);
  }


  constructor(
    private store: Store<{ auth: AuthState }>,
    private userService: UsersService,
    private sellerService: SellersService,
    private darkModeService: DarkModeService,
    private translateService: TranslateService

  ) { }

  togglePosition() {
    this.divTop = this.divTop === '-200px' ? '60px' : '-200px';
  }

  ngOnInit(): void {
    this.toGetTheUser();
    this.darkModeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });

    this.translateService.setDefaultLang(this.selectedLanguage);
    this.translateService.use(this.selectedLanguage);
    this.updateDirectionality(this.selectedLanguage);


  }

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

  changeLanguage() {
    this.translateService.use(this.selectedLanguage);
    this.updateDirectionality(this.selectedLanguage);
  }

  private updateDirectionality(languageCode: string) {
    this.dirAttribute = languageCode === 'ar' ? 'rtl' : 'ltr';
  }
}
