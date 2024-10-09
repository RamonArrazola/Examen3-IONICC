import { Component, Input, OnInit } from '@angular/core';
import { Contact } from '../../interfaces/index';
import { ContactServiceService } from 'src/app/services/contact-service.service';
import { UiServiceService } from 'src/app/services/ui-service.service';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent  implements OnInit {

  @Input() contactos: Contact[] = [];
  @Input() carga: boolean = false;
  // @HostListener('window:beforeunload', ['$event'])
  // unloadNotification($event: any) {
  //   this.ngOnInit();
  // }

  imgT: string = 'http://localhost:3000/'
  busqueda: string = '';

  constructor(private consulta: ContactServiceService,
              private ui: UiServiceService,
              private modalController: ModalController) { }

  ngOnInit() {
    this.obtenerContactos();
    setTimeout(() => {
      this.carga = true;
    }, 800);
  }

  editar(){

  }

  eliminar(item: any){
    this.consulta.DeleteContacto(item._id);
    this.ui.snackBar('Contacto eliminado', 'top');
    setTimeout(() => {
      this.obtenerContactos();
    }, 100);
  }

  
  handleRefresh(event: Event) {
    setTimeout(() => {
      this.obtenerContactos();
      if (event.target) {
        (event.target as any).complete();
      }
    }, 800);
  }

    onSearchChange(event:any){
    if(this.busqueda === '') {
      this.contactos = [...[]];
      this.busqueda = event.detail.value;
    } else{
      this.busqueda = event.detail.value;
    }
    this.consulta.ConsultaContacto(this.busqueda).subscribe((search: Contact[]) => {
      this.contactos = [...search];
    });
  }

  obtenerContactos(){
    this.consulta.ObtenerContactos().subscribe((resp) =>{
      this.contactos = [];
      this.contactos = [...this.contactos, ...resp];
    });
  }
}