import { Request, Response } from 'express';
import  Photo  from '../Models/Photos'; //Importar el modelo de la foto
import path from 'path';
import fs from 'fs';

// export function helloW(req: Request, res: Response){
//     res.send('Hola, mi Server funciona!');           // Hello World de prueba
// }

export async function createPhoto(req: Request, res: Response){

    const { title, description } = req.body;          //Obtener los datos del body
    const imgPath = req.file ? req.file.path : 'uploads\\thumb.jpg';  //Obtener la ruta de la imagen, si esta no existe, se asigna una por defecto
    const newPhoto = {
        titulo: title,
        descripcion: description,
        image: imgPath
    };
    const photo = new Photo(newPhoto);                //Crear un nuevo objeto de la foto
    await photo.save();

    res.json({
        ok: true,
        message: 'Foto guardada',
        photo: photo
    })
}

export async function obtenerPhoto(req: Request, res: Response){

    const photos = await Photo.find();                 //Buscar todas las fotos

    console.log('Obteniendo Fotos');

    res.json({
        ok: true,
        message: 'Fotos obtenidas',
        photos: photos
    })
}

export async function obtenerPhotoById(req: Request, res: Response){
    const { id } = req.params;                          //Obtener el id de la foto desde la peticion 
    const photo = await Photo.findById(id);             //Buscar la foto por id

    res.json({
        ok: true,
        message: 'Foto encontrada',
        photo: photo
    })
}

export async function eliminaPhoto(req: Request, res: Response){
    const { id } = req.params;                          //Obtener el id de la foto desde la peticion
    const photo = await Photo.findByIdAndDelete(id);    //Buscar la foto por id y eliminarla

    if (photo) {
        await fs.unlink(path.resolve(photo.image), (err) => {
            if (err) {
                console.error('Error deleting the file:', err);
            } else {
                console.log('File deleted successfully');
            }
        });
    }

    res.json({
        ok: true,
        message: 'Foto eliminada', 
        photo: photo
    })
}

export async function updatePhoto(req: Request, res: Response){
    const { id } = req.params;                          //Obtener el id de la foto desde la peticion
    const { title, description } = req.body;            //Obtener los datos del body
    console.log(req.body);

    const Uphoto = await Photo.findByIdAndUpdate(id, {
        titulo: title,
        descripcion: description
    }, { new: true });

    res.json({
        ok: true,
        message: 'Foto actualizada',
        photo: Uphoto
    })
}
    