import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ToastrModule } from 'ngx-toastr';
import { ChartjsModule } from '@coreui/angular-chartjs';
// import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


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
    
  ],
  imports: [
    ChartjsModule,
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatFormFieldModule,
    ToastrModule.forRoot()
  ],
  providers: [
    // provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
