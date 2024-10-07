import { CanLoad } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})

export class UsuarioGuard implements CanLoad {

  constructor(private userService: UsuarioService) { }

  canLoad(): Observable<boolean> | Promise<boolean> | boolean {
    return this.userService.validaToken();
  }

  
};
