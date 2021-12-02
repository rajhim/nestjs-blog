import { UserRole } from './../model/user.interface';
import { AuthService } from './../../auth/service/auth.service';


import { UserEntity } from './../model/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, OptimisticLockCanNotBeUsedError, Repository } from 'typeorm';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { User } from '../model/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {}

  create(user: User): Observable<User | Object> {
    return this.authService.hashPassword(user.password).pipe(
      switchMap((passwordHash) => {
        const newUser = new UserEntity();
        newUser.name = user.name;
        newUser.username = user.username;
        newUser.email = user.email;
        newUser.password = passwordHash;
        newUser.role = UserRole.USER;
        // newUser.blogs = user.blogs;
        return from(this.userRepository.save(newUser)).pipe(
          map((user: User) => {
            const { password, ...result } = user;
            return result;
          }),
          catchError((err) => {
            throw err;
          }),
        );
      }),
    );
  }

  findAll(): Observable<any> {
    return from(this.userRepository.find()).pipe(
      map((users: User[]) => {
        users.forEach(function (v) {
          delete v.password;
        });
        return users;
      }),
      catchError((err) => {
        throw err;
      }),
    );
  }

  paginate(options: IPaginationOptions): Observable<Pagination<User> | any> {
    return from(paginate<User>(this.userRepository, options)).pipe(
      map((userPageable: Pagination<User>) => {
        userPageable.items.forEach(function (v) {
          delete v.password;
        });
        return userPageable;
      }),
    );
  }

  paginateFilterByUsername(options: IPaginationOptions, user: User): Observable<Pagination<User>>{
    console.log( (Number(options.page) * Number(options.limit)));
    return from(this.userRepository.findAndCount({
      skip: (Number(options.page) * Number(options.limit)) || 0,
      take: Number(options.limit) || 10,
      order: {id: "ASC"},
      select: ['id', 'name', 'username', 'email', 'role'],
     
      where: [
        {username: Like(`%${user.username}%`)}
    ]
    })).pipe(
      map(([users, totalUsers]) => {
        const usersPageable: Pagination<User> = {
          items: users,
          links: {
            first: options.route + `?limit=${options.limit}`,
            previous: options.route,
            next: options.route + `?limit=${options.limit}&page=${options.page}`, 
            last: options.route + `?limit=${options.limit}&page=${ Math.ceil(totalUsers / Number(options.limit))}`, 
          },
          meta: {
            currentPage: Number(options.page),
            itemCount: Number(users.length),
            itemsPerPage: Number(options.limit),
            totalItems: totalUsers,
            totalPages: Math.ceil(totalUsers / Number(options.limit))
          }
        }; 
        return usersPageable;
      })
    )  

  }

  findById(id: number): Observable<User> {
    console.log('user find -->> ', id);
    return from(this.userRepository.findOne({id}, { relations: ['blogEntries'] })).pipe(
      map((user: User) => {
        console.log('user find -->> ', user);
        const { password, ...result } = user;
        return result;
      }),
      catchError((err) => {
        throw err;
      }),
    );
  }

  delete(id: string): Observable<any> {
    return from(this.userRepository.delete(id));
  }

  update(id: number, user: User): Observable<any> {
    delete user.email;
    delete user.password;
    delete user.role;
    console.log("update-->", user);
    return from(this.userRepository.update(id, user)).pipe(
      switchMap(() => this.findById(id))
  );
  }

  updateRoleOfUser(id: string, user: User): Observable<any> {
    delete user.email;
    delete user.password;
    return from(this.userRepository.update(id, user));
  }

  // login(user: User): Observable<string> {
  //   return this.validateUser(user.email, user.password).pipe(
  //     switchMap((users: User) => {
  //       if (users) {
  //         console.log('user-->', users);
  //         return this.authService.generateJWT(users).pipe(
  //           map((jwt: string) => {
  //             console.log('jwt success', jwt);
  //             return jwt;
  //           }),
  //           catchError((err) => {
  //             console.log('jwt error', err);
  //             throw err;
  //           }),
  //         );
  //       } else {
  //         return 'Wrong Credentials';
  //       }
  //     }),
  //   );
  // }

  

  // validateUser(email: string, password: string): Observable<any> {
  //   return this.findByMail(email).pipe(
  //     switchMap((user: User) => {
  //       return this.authService.comparePasswords(password, user.password).pipe(
  //         map((match: boolean) => {
  //           console.log('match', match, user);
  //           if (match) {
  //             const { password, ...result } = user;
  //             return result;
  //           } else {
  //             throw 'No User Found';
  //           }
  //         }),
  //       );
  //     }),
  //   );
  // }

  // findByMail(email: string): Observable<User> {
  //   return from(this.userRepository.findOne({ email })).pipe(
  //     map((user: User) => {
  //       console.log("findByMail found", user)
  //       return user;
  //     }),
  //     catchError((err) => {
  //       console.log("findByMail not found")
  //       throw err;
  //     }),
  //   );
  // }

  login(user: User): Observable<string> {
    return this.validateUser(user.email, user.password).pipe(
        switchMap((user: User) => {
            if(user) {
                return this.authService.generateJWT(user).pipe(map((jwt: string) => jwt));
            } else {
                return 'Wrong Credentials';
            }
        })
    )
}

validateUser(email: string, password: string): Observable<User> {
    return from(this.userRepository.findOne({email}, {select: ['id', 'password', 'name', 'username', 'email', 'role', 'profileImage']})).pipe(
        switchMap((user: User) => this.authService.comparePasswords(password, user.password).pipe(
            map((match: boolean) => {
                if(match) {
                    const {password, ...result} = user;
                    return result;
                } else {
                    throw Error;
                }
            })
        ))
    )

}

// findByMail(email: string): Observable<User> {
//     return from(this.userRepository.findOne({email}));
// }
}
