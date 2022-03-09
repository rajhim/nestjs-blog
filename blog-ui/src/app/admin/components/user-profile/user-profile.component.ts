import { UserService } from 'src/app/services/user/user.service';
import { User } from './../../../../../../project-name/src/user/model/user.interface';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  private sub?: Subscription;
  userId?: number;
  user?: User;

  constructor(private activatedRoute: ActivatedRoute,private formBuilder: FormBuilder, private service: UserService) { }

  ngOnInit(): void {

    // this.form = this.formBuilder.group({
    //   id: [{value: null, disabled: true}, [Validators.required]],
    //   name:[null, [Validators.required]],
    //   username:[null, [Validators.required]]
    // })

    this.sub = this.activatedRoute.params.subscribe(params => {
      this.userId = parseInt(params['id']);
      this.service.findById(this.userId)
        .subscribe((data: User)=> {
          this.user = data;
          // this.form.patchValue({
          //   id: data.id,
          //   name: data.name,
          //   username:data.username
          // })
        })
    })
  }

  ngOnDestroy(){
    this.sub?.unsubscribe();
  }


}
