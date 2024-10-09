import { Component } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UiServiceService } from '../../services/ui-service.service';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.page.html',
  styleUrls: ['./login-modal.page.scss'],
})
export class LoginModalPage{

  loginUserData = {
    email: 'avatar@avatar.com',
    password: 'avatar'
  }

  constructor(private modalController: ModalController,
              private usuarioService: UsuarioService,
              private ctrl: NavController,
              private ui: UiServiceService
  ) { }

  onClick(){
    this.modalController.dismiss();
  }

  async login(form: NgForm){
    if(form.invalid){
      return;
    }

    const valido = await this.usuarioService.login(this.loginUserData.email, this.loginUserData.password);

    if(valido){
      // navegar al tabs
      // this.ctrl.navigateRoot('/main/tabs/tab1', {animated: true});
      this.modalController.dismiss();
    } else {
      // Alerta de inicio de sesion incorrecto
      this.ui.presentAlert('Inicio de sesión incorrecto', 'Usuario o contraseña incorrectos');

    }
  }
}
