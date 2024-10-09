import { Component} from '@angular/core';
import { Capacitor } from '@capacitor/core';

import { NgForm } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';

import { UsuarioService } from 'src/app/services/usuario.service';
import { UiServiceService } from '../../services/ui-service.service';
import { Usuario } from 'src/app/interfaces';

@Component({
  selector: 'app-signup-modal',
  templateUrl: './signup-modal.page.html',
  styleUrls: ['./signup-modal.page.scss'],
})
export class SignupModalPage{

  signupUserData: Usuario = {
    email: '',
    password: '',
    avatar: null,
    nombre: ''
  }

  imgPlaceholder: string = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTukzAjp3NyC_fQDI1YbHpRZ7W3VcZj8G9wjg&s';
  avatarPreview: string | ArrayBuffer | null = null; // Elemento para almacenar la vista previa del avatar
  TempImg = '';

  onFileSelected(event: any) {

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

  async Cambio(event: any){
    if(event.target && event.target.files && event.target.files.length > 0){
      const file: File = event.target.files[0];
      console.log(file);
      if (file) {
        this.signupUserData.avatar = file;
        // await this.guardarImagen(file);
        await this.actualizarVistaPrevia(file);
      }
    } else {
      console.error('No file selected');
    }
  }

  // async guardarImagen(file: File) {
  //     const uniqueFileName = new Date().getTime() + '_' + file.name;
    
  //     const savedFile = await Filesystem.writeFile({
  //       path: uniqueFileName,
  //       data: await this.convertFileToBase64(file),
  //       directory: FilesystemDirectory.Data,
  //       recursive: true
  //     });
  //     this.TempImg = uniqueFileName;
    
  // }

  // async leerArchivo(filePath: string) {
  //   try {
  //     const contents = await Filesystem.readFile({
  //       path: filePath,
  //       directory: FilesystemDirectory.Data,
  //       encoding: FilesystemEncoding.UTF8
  //     });
  //     console.log('File contents:', contents.data);
  //   } catch (e) {
  //     console.error('Unable to read file', e);
  //   }
  // }

  // private async convertFileToBase64(file: File): Promise<string> {
  //   return new Promise<string>((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => resolve(reader.result as string);
  //     reader.onerror = error => reject(error);
  //   });
  // }

  private async actualizarVistaPrevia(file: File) {
    const reader = new FileReader(); 
    reader.onload = () => {
      this.avatarPreview = reader.result;
    }; 
    reader.readAsDataURL(file);
  }
}
