import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import * as _ from 'lodash';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OrdersComponent } from './Components/Orders/orders/orders.component';
import { CustomersComponent } from './Components/Customers/customers/customers.component';
import { OverviewComponent } from './Components/Overview/overview/overview.component';
import { HeaderComponent } from './Components/Header/header/header.component';
import { CustomerDetailsComponent } from './Components/Customer-details/customer-details/customer-details.component';
import { CategoriesComponent } from './Components/Categories/categories/categories.component';
import { SidebarComponent } from './Components/Sidebar/sidebar/sidebar.component';
import { ProductsComponent } from './Components/Product-routes/Products/products/products.component';
import { ProductDetailComponent } from './Components/Product-routes/Product-details/product-detail/product-detail.component';
import { NewProductComponent } from './Components/Product-routes/New-Product/new-product/new-product.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ToastrModule } from 'ngx-toastr';
import { ChartjsModule } from '@coreui/angular-chartjs';
// import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAuth, getAuth, } from '@angular/fire/auth';

import { environment } from './environment';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { UserLoginComponent } from './Components/user-login/user-login.component';
import { StoreModule } from '@ngrx/store';
import { authReducer } from './Services/Redux/Store/Admin.reducer';
import { SellerNewProductsComponent } from './Components/Seller/seller-new-products/seller-new-products.component';
import { SellerOrdersComponent } from './Components/Seller/seller-orders/seller-orders.component';
import { SellerProductsComponent } from './Components/Seller/seller-products/seller-products.component';
import { SellerProductDetailsComponent } from './Components/Seller/seller-product-details/seller-product-details.component';

import { Store } from '@ngrx/store';
import { UserRegisterComponent } from './Components/user-register/user-register.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    AppComponent,
    OrdersComponent,
    CustomersComponent,
    OverviewComponent,
    HeaderComponent,
    CustomerDetailsComponent,
    CategoriesComponent,
    SidebarComponent,
    ProductsComponent,
    ProductDetailComponent,
    NewProductComponent,
    UserLoginComponent,
    UserRegisterComponent,
    SellerNewProductsComponent,
    SellerOrdersComponent,
    SellerProductsComponent,
    SellerProductDetailsComponent

  ],
  imports: [
    ChartjsModule,
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    provideFirestore(() => getFirestore()),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    HttpClientModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatFormFieldModule,
    StoreModule.forRoot({ AuthReducer: authReducer }),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps:[HttpClient]
      }
      
    }),

    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
      progressBar: true,
      tapToDismiss: true,
      closeButton: true,
      resetTimeoutOnDuplicate: true,
      newestOnTop: true
    }),



  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(private store: Store) { }


}
