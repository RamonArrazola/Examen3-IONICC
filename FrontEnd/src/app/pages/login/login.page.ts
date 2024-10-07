import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { SignupModalPage } from '../signup-modal/signup-modal.page';
import { LoginModalPage } from '../login-modal/login-modal.page';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage{

  Bienvenida: string = 'Bienvenido'
  Text: string = 'Esta es una aplicacion de examen, \n por favor inicie sesion para continuar'

  constructor(private modalController: ModalController) { }

  async LogIn(){

    const modal = await this.modalController.create({
      component: LoginModalPage,
      componentProps: {
      }
    });
    await modal.present();
 
  }

  async SignUp(){
    const modal = await this.modalController.create({
      component: SignupModalPage,
      componentProps: {
      }
    });
    await modal.present();
  }
}
