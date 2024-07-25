import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  customerFormGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private customerService: CustomerService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.customerFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  get email() {
    return this.customerFormGroup.get('email');
  }

  get password() {
    return this.customerFormGroup.get('password');
  }

  onSubmit() {
    if (this.customerFormGroup.invalid) {
      this.customerFormGroup.markAllAsTouched();
      return;
    }

    const customer = this.customerFormGroup.value;

    this.customerService.login(customer).subscribe((data) => {
      if (data != null) {
        alert('Login Successful');

        // Storing values in storage
        this.authService.setFirstName(data.firstName);
        this.authService.setLastName(data.lastName);
        this.authService.setEmail(data.email);
        this.authService.setMobile(data.mobile.toString());

        // Redirect to home page
        this.router.navigateByUrl('');
      } else {
        alert("Invalid Credentials");
      }
    });
  }

  redirectToSignup() {
    this.router.navigateByUrl('/register');
  }
}