import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatToolbarModule} from '@angular/material/toolbar';
import { HeaderComponent } from '../layout/header/header.component';
import {MatIconModule} from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
@NgModule({
  declarations: [
    HeaderComponent
  ],
  imports: [CommonModule,RouterModule,MatButtonModule, MatToolbarModule, MatIconModule, MatSelectModule],

  exports: [HeaderComponent,RouterModule, MatToolbarModule, MatIconModule]
})
export class SharedModule {}
