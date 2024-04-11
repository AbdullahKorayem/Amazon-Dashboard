import { Component } from '@angular/core';
import { setDoc, doc, Firestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from 'src/app/Services/Users/users.service';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import {
	loggedIn,
	loginFail,
} from 'src/app/Services/Redux/Store/Admin.Actions';
import { AuthState } from './../../Services/Redux/Store/Admin.reducer';
import { from } from 'rxjs';
import { cloneDeep } from 'lodash';
import { Router } from '@angular/router';
import { SellersService } from 'src/app/Services/Users/sellers.service';



@Component({
	selector: 'app-user-login',
	templateUrl: './user-login.component.html',
	styleUrls: ['./user-login.component.css'],
})
export class UserLoginComponent {
	public login: FormGroup;

	public Admins: any[] = [];
	public theAdmin: any;

	public Sellers: any[] = [];
	public theSeller: any;

	constructor(
		private fb: FormBuilder,
		private user: UsersService,
		private firestore: Firestore,
		private toastr: ToastrService,
		private store: Store<{ auth: AuthState }>,
		private router: Router,
		private seller: SellersService
	) {
		this.login = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', Validators.required],
		});
	}

	toGetAdmins() {
		from(this.user.getAdmins()).subscribe(
			(res: any[]) => {
				this.Admins = res;
				console.log(this.Admins);
			},
			(err: any) => {
				console.log(err);
			}
		);
	}
	toGetSellers() {
		from(this.seller.getSellers()).subscribe(
			(res: any[]) => {
				this.Sellers = res;
				console.log(this.Sellers);
			},
			(err: any) => {
				console.log(err);
			}
		);
	}


	ngOnInit(): void {
		this.toGetAdmins();
		this.toGetSellers();

	}

	toGetTheUser(uid: string): any {
		return this.user.getUserByUid(uid);
	}
	toGetSellersUId(uid: string): any {
		return this.seller.getSellerByUid(uid);
	}







	async onSubmit() {
		if (this.login.valid) {
			const formData = this.login.value;

			try {
				const user = await this.user.SignInWithE_P(formData.email, formData.password);

				if (user) {
					const isAdmin = this.Admins.some(admin => admin.uid === user.uid);

					if (isAdmin) {
						console.log(user.uid);
						// Call toGetTheUser and wait for the result
						this.theAdmin = this.toGetTheUser(user.uid)
						console.log(this.theAdmin);
						sessionStorage.setItem('userUID', user.uid);
						sessionStorage.setItem('user', JSON.stringify(this.theAdmin));

						this.toastr.success('Admin logged in successfully');
						this.router.navigateByUrl('/overview');

					} else if (user) {
						const isSeller = this.Sellers.some(seller => seller.uid === user.uid);
						if (isSeller) {
							this.theSeller = this.toGetSellersUId(user.uid)
							sessionStorage.setItem('userUID', user.uid);
							sessionStorage.setItem('user', JSON.stringify(this.theSeller));
							this.toastr.success('Seller logged in successfully');
							this.router.navigateByUrl('seller-productsS');
						} else {

							this.toastr.error('Sign in failed: User is not an admin or a seller');
						}

					}
				} else {
					this.toastr.error('Sign in failed: User is not an admin or a seller');
				}
			} catch (error: any) {
				this.store.dispatch(loginFail({ error }));
				this.toastr.error('Error signing in user: ' + error.message);
			}
		}
	}
}
