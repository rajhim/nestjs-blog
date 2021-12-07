import { UserService } from 'src/app/services/user/user.service';
import { User } from './../../../../../../project-name/src/user/model/user.interface';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  private sub?: Subscription;
  userId?: number;
  user?: User;
  constructor(private activatedRoute: ActivatedRoute, private service: UserService) { }

  ngOnInit(): void {

    this.sub = this.activatedRoute.params.subscribe(params => {
      this.userId = parseInt(params['id']);
      this.service.findById(this.userId)
        .subscribe(data=> {
          this.user = data;
        })
    })
  }

  ngOnDestroy(){
    this.sub?.unsubscribe();
  }

}
