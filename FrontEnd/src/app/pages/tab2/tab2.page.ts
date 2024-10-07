import { Component, OnInit } from '@angular/core';
import { UiServiceService } from '../../services/ui-service.service';
import { Usuario } from 'src/app/interfaces';
import { NgForm } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

  UserData: Usuario = {
  }
  newData: Usuario = {}

  constructor(private ui: UiServiceService,
              private user: UsuarioService
  ) {}

  ngOnInit(){
    this.UserData = this.user.getUsuario();
    console.log(this.UserData);
  }

  handleRefresh(event: Event) {
    setTimeout(() => {
      this.UserData = this.user.getUsuario();
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

  avatar(){
    
  }
}
