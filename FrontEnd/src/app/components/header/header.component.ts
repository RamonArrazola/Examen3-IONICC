import { Component, Input} from '@angular/core';
import { UiServiceService } from 'src/app/services/ui-service.service';
import { Contact } from 'src/app/interfaces';
import { NgForm } from '@angular/forms';
import { ContactServiceService } from 'src/app/services/contact-service.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {

  @Input() title: string = '';

  public ContactData: Contact = {
    nombre: '',
    correo: '',
    img: null,
    telefono: ''
  }
  
  imgPlaceholder: string = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTukzAjp3NyC_fQDI1YbHpRZ7W3VcZj8G9wjg&s';
  avatarPreview: string | ArrayBuffer | null = null; // Elemento para almacenar la vista previa del avatar

  constructor(private ui: UiServiceService,
              private contact: ContactServiceService,
              private modalController: ModalController  
             ) { }

  logOut(){
    this.ui.logout();
  }

  avatar(){
    
  }
  
  async Add(data: NgForm){
    if(data.invalid){
      return;
    }
    const valid = await this.contact.AddContacto(this.ContactData);
    if (valid){
      this.ui.snackBar(`${this.ContactData.nombre} Agregado a contactos`, 'top');
      this.ContactData = {
        nombre: '',
        correo: '',
        img: null,
        telefono: '',
        usuario: ''
      };
      this.modalController.dismiss();
      this.avatarPreview = null;
      
    } else {
      this.ui.snackBar('Error al agregar contacto', 'top');
    }

  }

  async Cambio(event: any){
    if(event.target && event.target.files && event.target.files.length > 0){
      const file: File = event.target.files[0];

      if (file) {
        this.ContactData.img = file;
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
}