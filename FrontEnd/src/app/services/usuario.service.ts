import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { HttpOptions } from '@capacitor/core';
import { environment } from 'src/environments/environment';
import { UserResponse, Usuario } from '../interfaces/index';
import { NavController } from '@ionic/angular';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  token: string = '';
  private usuario: Usuario = {};
  // private UsrEmail: string = '';
  // private UsrAvatar: string = '';

  constructor(private http: HttpClient,
              private storage: Storage,
              private navCtrl: NavController) { }

  getUsuario(){
    const headers = new HttpHeaders({
    'x-token': this.token 
    })
    this.http.get<UserResponse>(`${URL}/user/`, {headers} ).subscribe((resp: any) => {
      if(!resp.ok){
        this.token = '';
        this.storage.clear();
        this.navCtrl.navigateRoot('/login');
        return null;
      }else {
        this.usuario = {};
        this.usuario = resp.user 
      }
      return {...this.usuario};
    });

    return {...this.usuario};
    
  }
  
  login(email: string, password: string){
    const data = {email, password};

    return new Promise(resolve =>{
      this.http.post(`${URL}/user/login`,data)
        .subscribe((resp: any) => {
        if (resp.ok === false){
          this.token = '';
          this.storage.clear();
          resolve(false);
        } else {
          this.SaveToken(resp['token']);
          // this.SaveUsrData(resp['usuario'], resp['avatar'], resp['token']);
          resolve(true);
          this.navCtrl.navigateRoot('/main/tabs/tab1', {animated: true});

        }
      });
    });

    
  }

  // SaveUsrData(email: string, avatar: string, token: string){
  //   this.storage.clear();
  //   this.UsrEmail = email;
  //   this.storage.set('email', email);
  //   this.UsrAvatar = avatar;
  //   this.storage.set('avatar', avatar);
  //   this.token = token;
  //   this.storage.set('token', token);
  // }

  async SaveToken(token: string){
    this.token = token;
    await this.storage.set('token', token);
  }

  signup(Usuario: Usuario) {
    const formData = new FormData();
    for (const key in Usuario) {
      if (Usuario.hasOwnProperty(key)) {
        formData.append(key, (Usuario as any)[key]);
      }
    }
    return new Promise(resolve => {
      this.http.post(`${URL}/user/create`, formData)
        .subscribe((resp: any) => {
          if (resp.ok === false) {
            this.token = '';
            this.storage.clear();
            resolve(false);
          } else {
            this.SaveToken(resp['token']);
            resolve(true);
          }
        });
    });
  }

  consultaCorreo(email: string) {
    return new Promise(resolve => {
      this.http.get(`${URL}/user/existe?email=${email}`)
        .subscribe((resp: any) => {
          if (resp.ok === false) {
            console.log(resp);
            resolve(false);
          } else {
            console.log(resp);
            resolve(true);
          }
        });
    });
  }

  async cargarToken(){
    this.token = await this.storage.get('token') || '';
  }

  async validaToken(): Promise<boolean> {

    await this.cargarToken();

    if(!this.token){
      this.navCtrl.navigateRoot('/login');
      return Promise.resolve(false);
    }

    return new Promise<boolean>(resolve => {
      const headers = new HttpHeaders({
        'x-token': this.token
      })

      this.http.get<{ ok: boolean, usuario: any }>(`${URL}/user`, {headers}).subscribe((resp=> {
        if(resp.ok){
          this.usuario = resp.usuario;
          resolve(true);
        } else {
          this.navCtrl.navigateRoot('/login');
          resolve(false);
        }
      }))
    });
  }

  logOut(){
    this.token = '';
    this.usuario = {};
    this.storage.clear();
    this.navCtrl.navigateRoot('/login', {animated: true});
  }

  UpdateUsr(usuario: Usuario){
    const headers = new HttpHeaders({
      'x-token': this.token
    });
    return new Promise(resolve => {
      this.http.put<{ ok: boolean, token: string }>(`${URL}/user/update`, usuario, {headers}).subscribe((resp: any) => {
        if(resp.ok){
          this.SaveToken(resp['token']);
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }
}
