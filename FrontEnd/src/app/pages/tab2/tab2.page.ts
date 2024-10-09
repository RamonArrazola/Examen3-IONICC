import { Component, Input, OnInit } from '@angular/core';
import { UiServiceService } from '../../services/ui-service.service';
import { Usuario } from 'src/app/interfaces';
import { NgForm } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})

export class Tab2Page implements OnInit{

  UserData: Usuario = {}
  newData: Usuario = {
    email: '',
    avatar: null,
    nombre: ''
  }

  tempAv:any = null; 

  avatarPreview: string | ArrayBuffer | null = null; // Elemento para almacenar la vista previa del avatar
  imgAvt: string = 'http://localhost:3000/uploads/thumb.jpg';

  constructor(private ui: UiServiceService,
              private user: UsuarioService
  ) {}

  ngOnInit(){
    this.UserData = this.user.getUsuario();
    if(this.UserData.avatar){
      this.avatarPreview = 'http://localhost:3000\\' + this.UserData.avatar;
    } 
  }

  handleRefresh(event: Event) {
    setTimeout(() => {
      this.UserData = this.user.getUsuario();
      if(this.UserData.avatar){
        this.avatarPreview = 'http://localhost:3000\\' + this.UserData.avatar;
      }
      if (event.target) {
        (event.target as any).complete();
      }
    }, 2000);
  }

  logOut(){
    this.ui.logout();
  }

  async update(form: NgForm){

    this.newData = form.value;
    this.newData.avatar = this.tempAv;
    if(form.invalid){
      return;
    }

    const valido = await this.user.UpdateUsr(this.newData);
    if(valido){
      this.ui.snackBar('Usuario actualizado', 'top');
    } else {
      this.ui.snackBar('Error al actualizar', 'top');
    }
  }

  async Cambio(event: any){
    if(event.target && event.target.files && event.target.files.length > 0){
      const file: File = event.target.files[0];
      console.log(file);
      if (file) {
        this.UserData.avatar = file;
        this.tempAv = file;
        await this.actualizarVistaPrevia(file);
      }
    } else {
      console.error('No file selected');
    }
  }
  
  private async actualizarVistaPrevia(file: File) {
    const reader = new FileReader(); 
    reader.onload = () => {
      this.avatarPreview = reader.result;
    }; 
    reader.readAsDataURL(file);
  }

  dataToBLOB(dataUri: string): File {
    // Separar el mimeString de los datos base64
    if (!dataUri || !dataUri.includes(',')) {
      throw new Error('Invalid data URI');
    }
    const [mimeTypePart, base64String] = dataUri.split(',');
    const mimeType = mimeTypePart.split(':')[1].split(';')[0];
    // Decodificar la cadena base64 en un ArrayBuffer
    const binaryData = atob(base64String);
    // Crear un ArrayBuffer con la longitud de la cadena decodificada
    const ab = new ArrayBuffer(binaryData.length);
    // Crear una vista de 8 bits del ArrayBuffer
    const ia = new Uint8Array(ab);
    // Recorrer la cadena decodificada y copiar los datos en el ArrayBuffer
    for (let i = 0; i < binaryData.length; i++) {
      ia[i] = binaryData.charCodeAt(i);
    }
    // Crear un blob con el ArrayBuffer
    const blob = new Blob([ab], { type: mimeType });
    // Crear un archivo a partir del blob
    const file = new File([blob], 'avatarUpload.jpg', { type: mimeType });
    // Retornar el archivo
    return file;
  }
}
