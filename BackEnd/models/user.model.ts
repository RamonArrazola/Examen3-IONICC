import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

const usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    avatar: {
        type: String,
        default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTukzAjp3NyC_fQDI1YbHpRZ7W3VcZj8G9wjg&s'
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es necesaria']
    }
});

usuarioSchema.method('comparePass', function(password = ''): boolean{
    if (bcrypt.compareSync(password, this.password)){
        return true;
    } else{
        return false;
    }
})

interface IUsuario extends Document{
    nombre: string;
    email: string;
    password: string;
    avatar: string; 

    comparrPass(password: string): boolean; //comparrPass
}

export const Usuario = model<IUsuario>('Usuario', usuarioSchema);