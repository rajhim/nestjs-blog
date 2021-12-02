import { User } from './../../user/model/user.interface';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { from, Observable, of } from 'rxjs';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  // generateJWT(user: User): Observable<string> {
  //   return from(this.jwtService.signAsync({ user }));
  // }

  // hashPassword(password: string): Observable<string> {
  //   return from(bcrypt.hash(password, 12));
  // }

  // comparePasswords(
  //   newPassword: string,
  //   passwordHash: string,
  // ): Observable<any | boolean> {
  //   console.log(newPassword, passwordHash);
  //   return from(bcrypt.compare(newPassword, passwordHash));
  // }
  generateJWT(user: User): Observable <string> {
    return from(this.jwtService.signAsync({user}));
}

hashPassword(password: string): Observable <string> {
    return from(bcrypt.hash(password, 12));

}

comparePasswords(newPassword: string, passwortHash: string): Observable<any>{
    return from(bcrypt.compare(newPassword, passwortHash));
}
  
}
