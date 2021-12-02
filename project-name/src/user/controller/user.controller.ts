import { IsUserGuard } from './../../auth/guards/isUser.guard';
import { Pagination } from 'nestjs-typeorm-paginate';
import { RolesGuard } from './../../auth/guards/roles.gurad';
import { JwtAuthGuard } from './../../auth/guards/jwt-guard';
import { User, UserRole } from './../model/user.interface';

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
import { UserService } from '../service/user.service';
import { Observable, catchError, of, map, switchMap } from 'rxjs';
import { hasRoles } from 'src/auth/decorator/role.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { join } from 'path';
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  create(@Body() user: any): Observable<User | any> {
    console.log('user body->', user);
    return this.userService.create(user).pipe(
      map((user: User) => user),
      catchError((err) => of({ error: err.message })),
    );
  }

  @Post('login')
  login(@Body() user: any): Observable<any> {
    return this.userService.login(user).pipe(
      map((jwt: string) => {
        return { access_token: jwt };
      }),
      catchError((err) => of({ error: err })),
    );
  }

  @Get(':id')
  findOne(@Param() params): Observable<User> {
    console.log('find one->', params);
    return this.userService.findById(params);
  }

  @Get()
  // @hasRoles(UserRole.ADMIN)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  index(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('username') username: string,
  ): Observable<Pagination<User>> {
    limit = limit > 100 ? 100 : limit;

    if (username === null || username === undefined) {
      return this.userService.paginate({
        page: Number(page),
        limit: Number(limit),
        route: 'http://localhost:3000/api/users',
      });
    } else {
      return this.userService.paginateFilterByUsername(
        {
          page: Number(page),
          limit: Number(limit),
          route: 'http://localhost:3000/api/users',
        },
        { username },
      );
    }
  }

  @Delete(':id')
  delete(@Param('id') id: string): Observable<User> {
    return this.userService.delete(id);
  }

  @UseGuards(JwtAuthGuard, IsUserGuard)
  @Put(':id')
  update(@Param('id') id: number, @Body() user: User): Observable<User> {
    return this.userService.update(id, user).pipe(
      switchMap(()=> this.findOne(id))
    );
  }

  @Put(':id/role')
  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateRoleOfUser(
    @Param('id') id: string,
    @Body() user: User,
  ): Observable<User> {
    return this.updateRoleOfUser(id, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/profileImages',
        filename: (req, file, cb) => {
          const fileName: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
          const extension: string = path.parse(file.originalname).ext;

          cb(null, `${fileName}${extension}`);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file, @Request() req): Observable<any> {

    const users: User = req.user.user;
    console.log("file -->", users);
    return this.userService.update(users.id, {profileImage: file.filename}).pipe(
      map((user:User)=> ({profileImage:user.profileImage})
    ))
  }

  @Get('profile-image/:imagename')
  findProfileImage(@Param('imagename') imagename, @Res() res): Observable<any> {

    return of(res.sendFile(join(process.cwd(), 'uploads/profileImages/' + imagename)))
  }
}
