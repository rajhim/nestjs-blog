import { UserService } from 'src/app/services/user/user.service';
import { AuthenticationService } from './../../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
})
export class UserEditComponent implements OnInit {
  form: FormGroup;
  constructor(
    private service: AuthenticationService,
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      id: [{ value: null, disabled: true }, [Validators.required]],
      name: [null, [Validators.required]],
      username: [null, [Validators.required]],
    });

    this.userService.getUserDetails()
    .subscribe(dat=>{
      this.userService.findById(dat)
      .subscribe((res: any) => {
        console.log(res);
        this.form.patchValue({
          id: res.id,
          name: res.name,
          username: res.username
        })
      })
    })
  }

  ngOnInit(): void {}

  submit() {
    if (this.form.invalid) {
      return;
    }
    this.userService.update(this.form.value).subscribe((data) => {
      console.log('success', data);
    });
  }

}
