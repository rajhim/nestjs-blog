import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { UserData, UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  dataSource?: any;

  pageEvent?: PageEvent;
  displayedColumns: string[] = ['id', 'name', 'username', 'email', 'role'];
  filterUsername?: string;

  constructor(private userService: UserService) {
    // this.dataSource = null;
  }

  ngOnInit(): void {
    this.initDataSource();
  }

  initDataSource(page?: number, size?: number) {
    this.userService.findAll(Number(page), Number(size)).subscribe((data) => {
      console.log('receive data', data);
      this.dataSource = data;
    });
  }

  onPaginateChange(event: PageEvent) {
    console.log(event);
    let page = event.pageIndex;
    if (this.filterUsername) {
      this.userService
        .paginateByName(page, event.pageSize, this.filterUsername)
        .subscribe((data) => {
          console.log('receive data', data);
          this.dataSource = data;
        });
    } else {
      page = page + 1;
      this.initDataSource(page, event.pageSize);
    }
  }

  findByName() {
    this.userService
      .paginateByName(0, 10, this.filterUsername)
      .subscribe((data) => {
        console.log('receive data', data);
        this.dataSource = data;
      });
  }
}
