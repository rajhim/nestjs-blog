import { AuthenticationService } from './../../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  constructor(private authService: AuthenticationService, private router: Router) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,

      ]),
    });
  }

  ngOnInit(): void {

  }

  login() {
    if(this.loginForm.invalid){
      return;
    }
    this.authService.login(this.loginForm.value).subscribe((data) => {
      console.log('success', data);
      this.router.navigate(['/admin'])
      localStorage.setItem("token", data);
    });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.loginForm.controls[controlName].hasError(errorName);
  };
}

export class LoginModel {
  email?: string;
  password?: string;
  constructor() {}
}
