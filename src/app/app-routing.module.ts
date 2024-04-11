import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './Components/Overview/overview/overview.component';
import { NewProductComponent } from './Components/Product-routes/New-Product/new-product/new-product.component';
import { ProductsComponent } from './Components/Product-routes/Products/products/products.component';
import { OrdersComponent } from './Components/Orders/orders/orders.component';
import { UserLoginComponent } from './Components/user-login/user-login.component';
import { AuthGuard } from './guards/auth.guard';

import { SellerProductsComponent } from './Components/Seller/seller-products/seller-products.component';
import { SellerNewProductsComponent } from './Components/Seller/seller-new-products/seller-new-products.component';
import { SellerOrdersComponent } from './Components/Seller/seller-orders/seller-orders.component';
import { SellerAuthGuard } from './guards/seller-auth.guard';
import { UserRegisterComponent } from './Components/user-register/user-register.component';
import { CategoriesComponent } from './Components/Categories/categories/categories.component';
import { CustomersComponent } from './Components/Customers/customers/customers.component';
import { SellerProductDetailsComponent } from './Components/Seller/seller-product-details/seller-product-details.component';
import { ProductDetailComponent } from './Components/Product-routes/Product-details/product-detail/product-detail.component';

const routes: Routes = [
  { path: 'login', component: UserLoginComponent },
  { path: 'toRegister', component: UserRegisterComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: 'overview', component: OverviewComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'products/new', component: NewProductComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'customers', component: CustomersComponent },
      {path: 'products/:id', component: ProductDetailComponent}
    ]
  },

  {
    path: '',
    canActivate: [SellerAuthGuard],
    children: [
      { path: 'seller-productsS', component: SellerProductsComponent },
      { path: 'seller-productsS/new', component: SellerNewProductsComponent },
      { path: 'seller-ordersS', component: SellerOrdersComponent },
      {path: 'seller-productsS/:id', component: SellerProductDetailsComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
exports: [RouterModule]
})
export class AppRoutingModule { }
