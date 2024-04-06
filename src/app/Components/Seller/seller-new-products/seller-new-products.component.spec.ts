import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerNewProductsComponent } from './seller-new-products.component';

describe('SellerNewProductsComponent', () => {
  let component: SellerNewProductsComponent;
  let fixture: ComponentFixture<SellerNewProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerNewProductsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SellerNewProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
