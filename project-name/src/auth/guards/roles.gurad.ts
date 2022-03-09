import { User } from './../../user/model/user.interface';
import { UserService } from './../../user/service/user.service';
import {
  CanActivate,
  ExecutionContext,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(forwardRef(() => UserService)) private userService: UserService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();

    const user = request.user;
      console.log(user);
    console.log('request-->>', user.user.id);
    return this.userService.findById(user.user.id).pipe(
      map((user: User) => {
        const hasRole = () => roles.indexOf(user.role) > -1;
        console.log('Role User', user, roles, hasRole());
        let hasPermission = false;
        if (hasRole()) {
          hasPermission = true;
        }
        return user && hasPermission;
      }),
    );
    return true;
  }
}
