import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupModalPage } from './signup-modal.page';

const routes: Routes = [
  {
    path: '',
    component: SignupModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignupModalPageRoutingModule {}
