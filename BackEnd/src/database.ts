import mongoose from "mongoose";

export async function iniciaConexion(){
    await mongoose.connect('mongodb://localhost:27017/Examen3API');
    console.log('Base de datos conectada');
}