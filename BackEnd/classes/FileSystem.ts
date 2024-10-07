import { FileUpload } from "../interfaces/file-upload";
import path from "path";
import fs from "fs";
import uniqid from "uniqid";

export default class FileSystem {
    constructor() {}
    
    // Guardar Imagenes Temporales
    SaveTempImage( file: FileUpload, userId: string){

        return new Promise((resolve: any, reject) => {
            // Creart Carpetas
            const path = this.MakeDir(userId);
            
            // Nombre del Archivo
            const fileName = this.UniqueNameGen(file.name);
            
            // Mover el archivo del Temp a nuestra carpeta
            file.mv(`${path}/${fileName}`, (err: any) => {
                if (err){
                    reject(err);
                } else{
                    resolve();
                }
            })
        });      
    }


    // Crear Directorios TMP y POST
    private MakeDir(userId: string){
        const pathUsr = path.resolve(__dirname, '../uploads/', userId);

        const pathUsrTemp = pathUsr + '/temp';

        const exists = fs.existsSync(pathUsr);
        if (!exists){
            fs.mkdirSync(pathUsr);
            fs.mkdirSync(pathUsrTemp);
        }

        return pathUsrTemp;
    }

    // Generar nombre Unico de Imagen
    private UniqueNameGen( nombreOriginal: string){
        const arrName = nombreOriginal.split('.');
        const extension = arrName[arrName.length -1];
        const uniqueId = uniqid();

        return `${ uniqueId}.${extension}`;
    }

    // Mover las imagenes de Temp a Post
    TempToPost(userId: string){
        const pathTemp = path.resolve(__dirname, '../uploads/', userId, 'temp');
        const pathPosts = path.resolve(__dirname, '../uploads/', userId, 'posts');

        if(!fs.existsSync(pathTemp)){
            return [];
        }

        if(!fs.existsSync(pathPosts)){
            fs.mkdirSync(pathPosts);
        }

        const imagesTemp = this.obtenerImgTemp(userId);

        imagesTemp.forEach(image => {
            fs.renameSync(`${pathTemp}/${image}`, `${pathPosts}/${image}`);
        });

        return imagesTemp;

    }

    // Obtener Imagenes Temporales
    private obtenerImgTemp(userId: string){
        const pathUsr = path.resolve(__dirname, '../uploads/', userId, 'temp');

        return fs.readdirSync(pathUsr) || [];
    }

    // Obtener Imagenes de Post
    GetImgUrl(userId: string, img: string){

        // Apuntar al Post de la imagen 
        const pathImg = path.resolve(__dirname, '../uploads/', userId, 'posts', img);

        // Verificar si la imagen Existe 
        const exists = fs.existsSync(pathImg);
        if (!exists){
            return path.resolve(__dirname, '../assets/404.png')
        }

        // Retornar la imagen (Path)
        return pathImg;
    }
}