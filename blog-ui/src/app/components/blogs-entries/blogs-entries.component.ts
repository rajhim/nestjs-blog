import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {BlogInterFace, BlogService} from "../../services/blog/blog.service";

@Component({
  selector: 'app-blogs-entries',
  templateUrl: './blogs-entries.component.html',
  styleUrls: ['./blogs-entries.component.scss']
})
export class BlogsEntriesComponent implements OnInit {
  dataSource: Observable<BlogInterFace>= this.service.findAll(1,10);
  pageEvent: any;
  constructor(private service: BlogService) { }

  ngOnInit(): void {

  }

  onPaginate(pageEvent: any){

  }

}
