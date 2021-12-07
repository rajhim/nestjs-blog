import { UserComponent } from './components/user/user.component';
import { RegisterComponent } from './components/register/register.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { OverviewComponent } from './components/overview/overview.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: OverviewComponent
  },
  {
    path: 'users',
    children: [
      {
        path: '',
        component: UserComponent
      },
      {
        path: 'edit',
         component: UserEditComponent,
         canActivate:[AuthGuard]
       },
      {
        path: ':id',
        component: UserProfileComponent
      },


    ]
  },




];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
