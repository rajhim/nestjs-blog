// import { BlogInterface } from 'src/blog/model/blog.interface';

export interface User {
  id?: number;
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  profileImage?: string;
  // blogs?: BlogInterface[];
}

export enum UserRole {
  ADMIN = 'admin',
  CHIEFEDITOR = 'chiefEditor',
  EDITOR = 'editor',
  USER = 'user',
}
