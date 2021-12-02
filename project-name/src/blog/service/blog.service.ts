import { UserService } from 'src/user/service/user.service';

import { BlogEntity } from './../model/blog.entity';
import { BlogInterface } from './../model/blog.interface';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, OptimisticLockCanNotBeUsedError, Repository } from 'typeorm';
import {
  catchError,
  map,
  Observable,
  switchMap,
  throwError,
  of,
  from,
} from 'rxjs';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { User } from 'src/user/model/user.interface';
const slugify = require('slugify');

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity)
    private readonly blogRepository: Repository<BlogEntity>,
    private UserService: UserService,
  ) {}

  create(user: User, blogEntry?: any): Observable<BlogInterface | any> {
    if (blogEntry && user) {
      blogEntry.author = user;
      return this.generateSlug(blogEntry.title).pipe(
        switchMap((slug: string) => {
          blogEntry.slug = slug;
          return from(this.blogRepository.save(blogEntry));
        }),
      );
    }
  }

  findAll(): Observable<BlogInterface[] | any> {
    return from(this.blogRepository.find({ relations: ['author'] }));
  }

  findByUser(userId: number): Observable<BlogInterface[] | any> {
    return from(
      this.blogRepository.find({
        where: {
          author: userId,
        },
        relations: ['author'],
      }),
    );
  }

  findById(id: number): Observable<BlogInterface | Object> {
    return from(this.blogRepository.findOne({id}, { relations: ['author'] }));
  }

  updateById(id: number, blog:  any): Observable<BlogInterface | Object> {
    return from(this.blogRepository.update(Number(id), blog));
  }

  deleteById(id: number): Observable<any> {
    return from(this.blogRepository.delete(Number(id)));
  }
  generateSlug(title: string): Observable<string> {
    return of(slugify(title));
  }
}
