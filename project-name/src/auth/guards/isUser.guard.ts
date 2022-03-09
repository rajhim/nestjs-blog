import {
  CanActivate,
  Inject,
  Injectable,
  forwardRef,
  ExecutionContext,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { User } from 'src/user/model/user.interface';
import { UserService } from 'src/user/service/user.service';

@Injectable()
export class IsUserGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}
  canActivate(context: ExecutionContext): boolean | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    
    const params = request.params;
    const user = request.user;
    console.log('is User guard request', user);
    return this.userService.findById(user.id).pipe(
        map((user: User)=> {
            let hasPermission = false;

            if(Number(user.id) === Number(params.id)){
                hasPermission = true;
            }

            return user && hasPermission;
        })
    );
  }
}
