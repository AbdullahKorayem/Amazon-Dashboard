import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './Components/Categories/categories/categories.component';
import { CustomerDetailsComponent } from './Components/Customer-details/customer-details/customer-details.component';
import { CustomersComponent } from './Components/Customers/customers/customers.component';
import { OrdersComponent } from './Components/Orders/orders/orders.component';
import { OverviewComponent } from './Components/Overview/overview/overview.component';
import { NewProductComponent } from './Components/Product-routes/New-Product/new-product/new-product.component';
import { ProductDetailComponent } from './Components/Product-routes/Product-details/product-detail/product-detail.component';
import { ProductsComponent } from './Components/Product-routes/Products/products/products.component';

const routes: Routes = [
  { path: 'overview', component: OverviewComponent },
  { path: 'products', component: ProductsComponent},
  { path: 'products/new', component: NewProductComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'customers/:id', component: CustomerDetailsComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'customers', component: CustomersComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: '', redirectTo: 'overview', pathMatch: 'full' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
