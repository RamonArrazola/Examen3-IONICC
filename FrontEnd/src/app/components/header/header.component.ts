import { Component, Input} from '@angular/core';
import { UiServiceService } from 'src/app/services/ui-service.service';
import { Post, Usuario } from 'src/app/interfaces';
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

  public ContactData: Post = {
    nombre: '',
    correo: '',
    img: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTukzAjp3NyC_fQDI1YbHpRZ7W3VcZj8G9wjg&s'],
    telefono: ''
  }

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
        img: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTukzAjp3NyC_fQDI1YbHpRZ7W3VcZj8G9wjg&s'],
        telefono: ''
      };
      this.modalController.dismiss();
      
    } else {
      this.ui.snackBar('Error al agregar contacto', 'top');
    }

  }
}