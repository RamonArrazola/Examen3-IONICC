import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../interfaces/index';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {

  constructor(private http: HttpClient) { }

  private Query<T>(endpoint: string){
    return this.http.get<T>(`${ URL }${ endpoint }`,{
      params: {
        //api_key: API_KEY,
        format: 'json'
      }
    })
  }

  getUsers(){
    return new Promise(resolve => {
      this.http.get<Post>(`${URL}/posts`)
      .subscribe((resp: any) => {
        resolve(resp);
      });
    });
  }
}
