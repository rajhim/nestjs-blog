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
import {User} from "../../user/model/user.interface";

export const storage = {
  storage: diskStorage({
    destination: './uploads/blog-images',
    filename: (req, file, cb) => {
      const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`)
    }
  })

}
@Controller('blogs')
export class BlogController {
  constructor(private service: BlogService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() blogs: BlogInterface,
    @Request() req,
  ): Observable<BlogInterface | any> {
    const user = req.user;
    return this.service.create(user, blogs);
  }

  @Get('')
  index(
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10
  ) {
    limit = limit > 100 ? 100 : limit;


    return this.service.paginateAll({
      limit: Number(limit),
      page: Number(page),
      route: ''
    })
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
  @Get('user/:user')
  indexByUser(
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10,
      @Param('user') userId: number
  ) {
    limit = limit > 100 ? 100 : limit;

    return this.service.paginateByUser({
      limit: Number(limit),
      page: Number(page),
      route: ''
    }, Number(userId))
  }

  @Get(':id')
  findById(@Param('id') id: number): Observable<BlogInterface | any> {
    return this.service
      .findById(id)
      .pipe(catchError((err) => of({ error: err.message })));
  }

  @UseGuards(JwtAuthGuard, IsUserGuard)
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

  @UseGuards(JwtAuthGuard)
  @Post('image/upload')
  @UseInterceptors(FileInterceptor('file', storage))
  uploadFile(@UploadedFile() file, @Request() req): Observable<any> {
    return of(file);
  }

  @Get('image/:imagename')
  findImage(@Param('imagename') imagename, @Res() res): Observable<any> {
    return of(res.sendFile(join(process.cwd(), 'uploads/blog-images/' + imagename)));
  }
}
