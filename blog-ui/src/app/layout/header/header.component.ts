import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(private router: Router) {}
   entries = [{
     name: 'Login',
     link: 'login'
   },
  {
    name: 'Register',
    link: 'register'
  },
  {
    name: 'Update Profile',
    link: 'admin/users/edit'
  }
]
  ngOnInit(): void {}

  navigateTo(value: any) {
    console.log(value);
    this.router.navigate(['../'+ value]);
  }
}
