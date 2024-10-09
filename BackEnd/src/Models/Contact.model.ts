import { Schema, Document, model}from 'mongoose'; 

const ContactSchema = new Schema({

    nombre: {
        type: String
    },
    telefono: {
        type: String,
        unique: true,
        required: [true, 'El telefono es necesario']
    },
    img: {
        type: String
    },
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
    img: string;
    correo: string;
    usuario: string;
};

export default model<IPost>('Post', ContactSchema);