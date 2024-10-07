import { Component} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UiServiceService } from '../../services/ui-service.service';
import { Usuario } from 'src/app/interfaces';
// import { CameraOptions } from '@capacitor/core';


@Component({
  selector: 'app-signup-modal',
  templateUrl: './signup-modal.page.html',
  styleUrls: ['./signup-modal.page.scss'],
})
export class SignupModalPage{

  signupUserData: Usuario = {
    email: '',
    password: '',
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTukzAjp3NyC_fQDI1YbHpRZ7W3VcZj8G9wjg&s',
    nombre: ''
  }

  constructor(private modalController: ModalController,
              private ctrl: NavController,
              private usuarioService: UsuarioService,
              private ui: UiServiceService
  ) { }

  onClick(){
    this.modalController.dismiss();
  }

  private debounceTimer: any;

  onChange(event: Event){
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.validae();
    }, 1000);
  }

  async validae(){
    const existe = await this.usuarioService.consultaCorreo(this.signupUserData.email as string);
    if(existe){
      this.ui.snackBar('Correo ya registrado', 'bottom');
      this.signupUserData.email = '';
    }
  }

  async signUp(data: NgForm){

    if(data.invalid){
      return;
    }

    const valido = await this.usuarioService.signup(this.signupUserData);

    if(valido){
      // navegar al tabs
      this.ctrl.navigateRoot('/main/tabs/tab1', {animated: true});
      this.modalController.dismiss();
      this.ui.snackBar(`Bienvenido ${this.signupUserData.nombre}!`, 'top');
    } else {
      // Alerta de inicio de sesion incorrecto
      this.ui.presentAlert('Ups!', 'Ocurrio un error');

    }
  }

  avatar(){
    // const options: CameraOptions = {

    // }
  };
}
