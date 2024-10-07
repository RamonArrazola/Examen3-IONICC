import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../../interfaces/index';
import { ContactServiceService } from 'src/app/services/contact-service.service';
import { UiServiceService } from 'src/app/services/ui-service.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent  implements OnInit {

  @Input() contactos: Post[] = [];
  @Input() carga: boolean = false;

  page = 0;
  busqueda: string = '';

  constructor(private consulta: ContactServiceService,
              private ui: UiServiceService) { }

  ngOnInit() {
    this.consulta.ObtenerContactos(this.page).subscribe((resp) =>{
      this.contactos = [...this.contactos, ...resp];
    });

    setTimeout(() => {
      this.carga = true;
    }, 2000);
  }

  editar(){

  }

  eliminar(item: any){
    this.consulta.DeleteContacto(item._id);
    this.ui.snackBar('Contacto eliminado', 'top');
    setTimeout(() => {
      this.consulta.ObtenerContactos(this.page).subscribe((resp) =>{
        this.contactos = [];
        this.contactos = [...this.contactos, ...resp];
      });
    }, 100);
      
      
  }

  
  handleRefresh(event: Event) {
    setTimeout(() => {
      this.consulta.ObtenerContactos(this.page).subscribe((resp) =>{
        this.contactos = [];
        this.contactos = [...this.contactos, ...resp];
      });
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
    this.consulta.ConsultaContacto(this.busqueda).subscribe((search: Post[]) => {
      this.contactos = [...search];
    });
  }

}
