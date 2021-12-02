import { UserModule } from './../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { BlogController } from './controller/blog.controller';
import {  BlogEntity } from './model/blog.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogService } from './service/blog.service';

@Module({
  imports: [TypeOrmModule.forFeature([BlogEntity]), AuthModule, UserModule],
  providers: [BlogService],
  controllers: [BlogController],
  exports: [BlogService],
})
export class BlogModule {}
