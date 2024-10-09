import { Injectable } from '@angular/core';
import { Post, ContactResponse, Contact, ContactSearch } from '../interfaces/index';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class ContactServiceService {

  token: string = '';
  private ContactS: ContactSearch = {
    ok: false,
    contact: []
  }
  private ContactR: ContactResponse = {
    ok: false,
    message: '',
    contacts: []
  };

  constructor(private http: HttpClient,
              private storage: Storage,) { }

  private Query<T>(endpoint: string){
    return this.http.get<T>(`${ URL }${ endpoint }`,{
      headers: {
        'x-token': this.token
      }
    })
  }

  async cargarToken(){
    this.token = await this.storage.get('token') || '';
  }


  async AddContacto(data: Contact){
    await this.cargarToken();
    const headers = new HttpHeaders({
      'x-token': this.token
    });

    const formData = new FormData();

    formData.append('nombre', data.nombre);
    data.telefono ? formData.append('telefono', data.telefono) : null;
    data.correo ? formData.append('correo', data.correo) : null;
    formData.append('img', data.img);

    return new Promise(resolve => {
      this.http.post<Post>(`${URL}/post/`, formData, {headers})
      .subscribe((resp: any) => {
        console.log(resp);
        resolve(resp);
      });
    });
  }

  ConsultaContacto(busqueda: string):Observable<Contact[]>{
    this.cargarToken();

    return this.Query<ContactSearch>(`/post/${busqueda}`).pipe(
      map((resp) => {
        this.ContactS = {
          ok: resp.ok,
          contact: resp.contact
        };
        return this.ContactS.contact;
      })
    );
  }

  ObtenerContactos(): Observable<Contact[]>{
    this.cargarToken();
    console.log(this.token);

    return this.Query<ContactResponse>('/post/').pipe(
      map((res) => {
        if(res.contacts.length === 0){ 
          return this.ContactR.contacts; 
        } 
        return this.ContactR.contacts = res.contacts;
      })
    );
  }

  async UpdateContacto(data: Post){
    await this.cargarToken();
    const headers = new HttpHeaders({
      'x-token': this.token
    });

    return new Promise(resolve => {
      this.http.put<Post>(`${URL}/posts/`, data, {headers})
      .subscribe((resp: any) => {
        console.log(resp);
        resolve(resp);
      });
    });
  }

  async DeleteContacto(id: string){
    await this.cargarToken();
    const headers = new HttpHeaders({
      'x-token': this.token
    });

    return new Promise(resolve => {
      this.http.delete<Post>(`${URL}/post/${id}`, {headers})
      .subscribe((resp: any) => {
        resolve(resp);
      });
    });
  }

}
