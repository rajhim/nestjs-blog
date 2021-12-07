
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of, switchMap } from 'rxjs';
import { JWT_TOKEN, User } from '../authentication.service';

const userUrl = 'http://localhost:3000/api/user';

export interface UserData {
  items: User[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemPerPage: number;
    totalPages: number;
  };
  links: {
    first: string;
    previous: string;
    next: string;
    last: string;
  };
  name?: string;
  username?: string;
  email?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpClient,
    private jwtHelperService: JwtHelperService
  ) {}

  findById(id: number): Observable<UserData> {
    return this.http.get(userUrl + '/' + id).pipe(
      map((res: any) => {
        // localStorage.setItem('token', res.access_token);
        return res;
      })
    );
  }
  getUserDetails(): Observable<any> {
    console.log("get userdetails-->>", localStorage.getItem(JWT_TOKEN));
    return of(localStorage.getItem(JWT_TOKEN)).pipe(
      switchMap((jwt: any) => of(this.jwtHelperService.decodeToken(jwt)).pipe(
        map((jwt: any) => jwt.user.id))
      )
      )
  }
  update(user: any): Observable<UserData> {
    return this.http.put(userUrl + '/' + user.id, user).pipe(
      map((res: any) => {
        // localStorage.setItem('token', res.access_token);
        return res;
      })
    );
  }

  findAll(page: number, size: number): Observable<UserData> {
    let params = new HttpParams();
    params = params.append('page', page);
    params = params.append('limit', size);
    return this.http.get(userUrl, { params }).pipe(
      map((res: any) => {
        // localStorage.setItem('token', res.access_token);
        return res;
      })
    );
  }
  paginateByName(
    page: number,
    size: number,
    username: any
  ): Observable<UserData> {
    let params = new HttpParams();
    params = params.append('page', page);
    params = params.append('limit', size);
    params = params.append('username', username);
    return this.http.get(userUrl, { params }).pipe(
      map((res: any) => {
        // localStorage.setItem('token', res.access_token);
        return res;
      })
    );
  }
  // register(model: User): Observable<any> {
  //   return this.http.post(registerUrl, model).pipe(
  //     map((res: any) => {
  //       localStorage.setItem('token', res.access_token);
  //       return res;
  //     })
  //   );
  // }
}
