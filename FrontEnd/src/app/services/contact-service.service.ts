import { Injectable } from '@angular/core';
import { Post, PostResponse, Posts, PostPage, PostSearch } from '../interfaces/index';
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
  private PostPage: PostPage = {};
  private PostSearch: PostSearch = {
    ok: false,
    post: []
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


  async AddContacto(data: Post){
    await this.cargarToken();
    const headers = new HttpHeaders({
      'x-token': this.token
    });
    return new Promise(resolve => {
      this.http.post<Post>(`${URL}/posts/`, data, {headers})
      .subscribe((resp: any) => {
        console.log(resp);
        resolve(resp);
      });
    });
  }

  ConsultaContacto(busqueda: string):Observable<Post[]>{
    this.cargarToken();
    console.log(this.token);
    
    const page = 1;

    return this.Query<PostSearch>(`/posts/busca?nombre=${busqueda}`).pipe(
      map((resp) => {
        this.PostSearch = {
          ok: resp.ok,
          post: resp.post
        };
        return this.PostSearch.post;
      })
    );
  }

  ObtenerContactos(page: any): Observable<Post[]>{
    this.cargarToken();

      this.PostPage[page] = {
        page: 0,
        posts: []
      }

    const pagina = this.PostPage[page].page + 1;

    return this.Query<PostResponse>('/posts/').pipe(
      map((posts) => {

        if(posts.posts.length === 0){ return this.PostPage[page].posts; }

        this.PostPage[page] = {
          page: pagina,
          posts: [...this.PostPage[page].posts, ...posts.posts]
        }
        return this.PostPage[page].posts;
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
      this.http.delete<Post>(`${URL}/posts/delete?id=${id}`, {headers})
      .subscribe((resp: any) => {
        console.log(resp);
        resolve(resp);
      });
    });
  }

}
