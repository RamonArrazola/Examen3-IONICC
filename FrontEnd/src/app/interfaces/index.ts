export interface UserResponse {
    ok:      boolean;
    usuario: Usuario;
}

export interface Usuario {
    _id?:    string;
    nombre?: string;
    email?:  string;
    avatar?: any;
    password?: string;
}

export interface ContactResponse {
    ok:       boolean;
    message:  string;
    contacts: Contact[];
}

export interface Contact {
    _id?:      string;
    nombre:   string;
    telefono: string;
    img?:      any;
    correo?:   string;
    usuario?:  string;
    __v?:      number;
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
    mensaje: string;
    posts:  Post[];
}

export interface Post {
    _id?:       string;
    nombre:    string;
    telefono?: string;
    img?:       any;
    correo?:   string;
    usuario?:   Usuario;
    __v?:       number;
}

export interface PostSearch {
    ok:   boolean;
    post: Post[];
}

export interface ContactSearch {
    ok: boolean;
    contact: Contact[];
}


