import { Schema, Document, model}from 'mongoose'; 

const postSchema = new Schema({

    nombre: {
        type: String
    },
    telefono: {
        type: String
    },
    img: [{
        type: String,
    }],
    correo: {
        type: String
    }, 
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Debe de existir una referencia a un usuario']
    }

});

interface IPost extends Document {
    nombre: string;
    telefono: string;
    img: string[];
    correo: string;
    usuario: string;
};

export const Post = model<IPost>('Post', postSchema);