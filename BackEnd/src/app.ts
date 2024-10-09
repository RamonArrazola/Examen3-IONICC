import express from "express";
import morgan from "morgan";
import indexRoutes from "./Routes/index";
import path from "path";
import cors from "cors";

const app = express();

//CORS
app.use(cors());

//settings 
app.set('port', process.env.PORT || 3000); //Establece el puerto en el que se va a ejecutar el servidor

//middlewares
app.use(morgan('dev')); //Obtiene información de las peticiones que se hacen al servidor
app.use(express.json()); //Permite que el servidor pueda entender archivos JSON

//Routes 
app.use('/api', indexRoutes); //Establece la ruta base de la API

//Carpeta pública (Usado para almacenar archivos publicos como imagenes, archivos, etc)
app.use('/uploads', express.static(path.resolve('uploads')));


export default app;