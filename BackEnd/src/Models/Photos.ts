import { Schema, model, Document } from 'mongoose';

const schema = new Schema({
    titulo: String,
    descripcion: String,
    image: String
});

interface IPhoto extends Document {
    titulo: string;
    descripcion: string;
    image: any;
}

export default model<IPhoto>('Photo', schema);