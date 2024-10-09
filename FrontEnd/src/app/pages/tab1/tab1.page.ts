import { Component, OnInit} from '@angular/core';
import { ContactServiceService } from 'src/app/services/contact-service.service';
import { Contact } from 'src/app/interfaces';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

  contactos: Contact[] = [];
  carga: boolean = false;

  constructor(private consulta: ContactServiceService) {}

 ngOnInit(){
  this.obtenerContactos();
 }

 obtenerContactos(){
  this.consulta.ObtenerContactos().subscribe((resp) =>{
    this.contactos = [];
    this.contactos = [...this.contactos, ...resp];
  });
}
}
