import { Component } from '@angular/core';
import { setDoc, doc, Firestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from 'src/app/Services/Users/users.service';

import { EMPTY, from } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-Register-login',
  templateUrl: './user-Register.component.html',
  styleUrls: ['./user-Register.component.css']
})
export class UserRegisterComponent {
  public User: FormGroup;
  public Admins: any[] = [];

  constructor(
    private fb: FormBuilder,
    private user: UsersService,
    private firestore: Firestore,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.User = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      isAdmin: false
    });
  }

  toGetAdmins() {
    from(this.user.getAdmins()).subscribe((res: any[]) => {
      this.Admins = res;
    },
      (err: any) => {
        console.log(err);
      }
    );
  }

  async onSubmit() {
    if (this.User.valid) {
      const formData = this.User.value;
      try {
        if (formData.isAdmin && this.Admins.length >= 1) {
          formData.isAdmin = true;
          const user = await this.user.createUser(formData.email, formData.password);
          await setDoc(doc(this.firestore, 'Admins', user?.uid), {
            id: user?.uid,
            UserName: formData.username,
            isAdmin: formData.isAdmin
          });
          this.toastr.success('Admin created successfully');
          this.router.navigateByUrl('/login');
        } else {
          this.toastr.warning('Can Only Have Two Admins');
          formData.isAdmin = false;
          const user = await this.user.createUser(formData.email, formData.password);
          await setDoc(doc(this.firestore, 'Sellers', user?.uid), {
            uid: user?.uid,
            UserName: formData.username,
            isAdmin: formData.isAdmin
          });
          this.toastr.success('User created successfully');
          this.router.navigateByUrl('/login');
        }
      } catch (error) {

        this.toastr.error('Failed to create user it is already exist');
        console.error('Error creating user:', error);
      }
    }
  }

}

