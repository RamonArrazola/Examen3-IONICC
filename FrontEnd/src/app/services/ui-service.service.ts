import { Injectable } from '@angular/core';
import { Usuario } from '../interfaces';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class UiServiceService {

  constructor(private usuarioService: UsuarioService) { }

  async presentAlert(header: string, message: string) {
    const alert = await document.createElement('ion-alert');
    alert.header = header;
    alert.message = message;
    alert.buttons = ['OK'];

    document.body.appendChild(alert);
    await alert.present();
  }

  async logout(){
    const alert = await document.createElement('ion-alert');
    alert.header = 'Cerrar Sesion',
    alert.message = '¿Estás seguro que deseas salir?';
    alert.buttons = [{
      text: 'Cancelar',
      role: 'cancel',
      cssClass: 'secondary',
      handler: () => {
      }
    }, {
      text: 'Aceptar',
      handler: () => {
        this.usuarioService.logOut();
      }
    }]

    document.body.appendChild(alert);
    await alert.present();
  }

  async confirmAlert(header: string, data: Usuario){
    const alert = await document.createElement('ion-alert');
    alert.header = header;
    alert.message = `Email: ${data.email} \n Password: ${data.password} \n Nombre: ${data.nombre} \n Avatar: ${data.avatar}`;
    // alert.message = `Nombre: ${data.nombre}`;
    // alert.message = `Email: ${data.email}`;
    alert.buttons = [
      {
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary'
      }, {
        text: 'Aceptar',
        handler: () => {
        }
      }
    ];

    document.body.appendChild(alert);
    await alert.present();
  }

  async snackBar(message: string, position: any){
    const toast = await document.createElement('ion-toast');
    toast.message = message;
    toast.duration = 2000;
    toast.position = position;

    document.body.appendChild(toast);
    return toast.present();
  }
}
