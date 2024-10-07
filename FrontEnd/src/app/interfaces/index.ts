export interface UserResponse {
    ok:      boolean;
    usuario: Usuario;
}

export interface Usuario {
    _id?:    string;
    nombre?: string;
    email?:  string;
    avatar?: string;
    password?: string;
}

export interface ContactResponse {
    ok:     boolean;
    pagina: number;
    posts:  Post[];
}

export interface Posts {
    post: Post[];
}
export interface PostPage {
    [key: string]: {
        page: number;
        posts: Post[];
    }
}

export interface PostResponse {
    ok:     boolean;
    pagina: number;
    posts:  Post[];
}

export interface Post {
    _id?:       string;
    nombre:    string;
    telefono?: string;
    img?:       any[];
    correo?:   string;
    usuario?:   Usuario;
    __v?:       number;
}

export interface PostSearch {
    ok:   boolean;
    post: Post[];
}



