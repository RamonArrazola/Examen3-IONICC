import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignupModalPageRoutingModule } from './signup-modal-routing.module';

import { SignupModalPage } from './signup-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignupModalPageRoutingModule
  ],
  declarations: [SignupModalPage]
})
export class SignupModalPageModule {}
