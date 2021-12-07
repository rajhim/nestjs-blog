import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, map } from 'rxjs';

const loginUrl = 'http://localhost:3000/api/user/login';
const registerUrl = 'http://localhost:3000/api/user';
export interface LoginForm {
  email?: string;
  password?: string;
}
export interface User {
  name?: string;
  username?: string;
  email?: string;
  role?: string;
  password?: string;
  confirmPassword?: string;
}

export const JWT_TOKEN = 'blog-token'

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {}

  login(model: LoginForm): Observable<any> {
    return this.http.post(loginUrl, model).pipe(
      map((res: any) => {
        localStorage.setItem(JWT_TOKEN, res.access_token);
        return res;
      })
    );
  }
  register(model: User): Observable<any> {
    return this.http.post(registerUrl, model).pipe(
      map((res: any) => {
        // localStorage.setItem(JWT_TOKEN, res.access_token);
        return res;
      })
    );
  }

  isAuthenticated(){
      const token = JSON.stringify(localStorage.getItem(JWT_TOKEN));
      return !this.jwtHelper.isTokenExpired(token);
  }
}
