import { BlogInterface } from './../model/blog.interface';

import {
  CanActivate,
  Inject,
  Injectable,
  forwardRef,
  ExecutionContext,
} from '@nestjs/common';
import { Observable, map, switchMap } from 'rxjs';
import { User } from 'src/user/model/user.interface';
import { UserService } from 'src/user/service/user.service';
import { BlogService } from '../service/blog.service';

@Injectable()
export class IsUserAuthorGuard implements CanActivate {
  constructor(
    // @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private blogService: BlogService,
  ) {}
  canActivate(context: ExecutionContext): boolean | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const params = request.params;
    const blogId = params.id;
    const user = request.user.user;
    return this.userService.findById(user.id).pipe(
      switchMap((user: User) =>
        this.blogService.findById(blogId).pipe(
          map((blog: BlogInterface) => {
            let hasPermission = false;

            if (Number(user.id) === Number(blog.author.id)) {
              hasPermission = true;
            }
            return user && hasPermission;
          }),
        ),
      ),
    );
  }
}
