import { IsUserAuthorGuard } from './../guards/isUserAuthor.guard';
import { BlogInterface } from './../model/blog.interface';
import { IsUserGuard } from '../../auth/guards/isUser.guard';
import { Pagination } from 'nestjs-typeorm-paginate';
import { RolesGuard } from '../../auth/guards/roles.gurad';
import { JwtAuthGuard } from '../../auth/guards/jwt-guard';

import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Put,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
  Request,
  Res,
} from '@nestjs/common';
import { BlogService } from '../service/blog.service';
import { Observable, catchError, of, map, switchMap } from 'rxjs';
import { hasRoles } from 'src/auth/decorator/role.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { join } from 'path';
@Controller('blogs')
export class BlogController {
  constructor(private service: BlogService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() blogs: BlogInterface,
    @Request() req,
  ): Observable<BlogInterface | any> {
    const user = req.user.user;
    return this.service.create(user, blogs);
  }

  @Get()
  findBlog(@Query('userId') userId: number): Observable<BlogInterface[]> {
    if (userId) {
      return this.service
        .findByUser(userId)
        .pipe(catchError((err) => of({ error: err.message })));
    } else {
      return this.service
        .findAll()
        .pipe(catchError((err) => of({ error: err.message })));
    }
  }

  @Get(':id')
  findById(@Param('id') id: number): Observable<BlogInterface | any> {
    return this.service
      .findById(id)
      .pipe(catchError((err) => of({ error: err.message })));
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  updateById(@Param('id') id: number, @Body() blog: BlogInterface): Observable<BlogInterface | any> {
    return this.service
      .updateById(id, blog)
      .pipe(catchError((err) => of({ error: err.message })));
  }

  @UseGuards(JwtAuthGuard, IsUserAuthorGuard)
  @Delete(':id')
  deleteById(@Param('id') id: number): Observable< any> {
    return this.service
      .deleteById(id)
      .pipe(catchError((err) => of({ error: err.message })));
  }
}
