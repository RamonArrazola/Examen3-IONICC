import { Request, Response } from 'express';
import Post from '../Models/Contact.model';
import fs from 'fs';
import path from 'path';

// Crear Contactos 

export async function createContact(req: any, res: Response){
    const {                                                            //Obtenemos los datos desde el FrontEnd
        nombre,
        telefono, 
        correo
    } = req.body;
    const imgPath = req.file ? req.file.path : 'uploads\\thumb.jpg';

    console.log(req.body);
    console.log(req.file);
    console.log(req.usuario._id);

    const Newcontact = {                                                //Creamos el nuevo contacto   
        nombre: nombre,
        telefono: telefono,
        img: imgPath,
        correo: correo,
        usuario: req.usuario._id
    }

    await Post.create(Newcontact).then((contact) => {
        res.json({
            ok: true,
            message: 'Contacto creado',
            contact: contact
        });
    }).catch((err: any) => {
        res.json({
            ok: false,
            err: err
        });
        if(Newcontact.img !== 'uploads\\thumb.jpg'){
            fs.unlink(path.resolve(Newcontact.img), (err) => {
                if (err) { console.error('Error deleting the file:', err); }
            })
        }   
    });
};

// Obtener Contactos
export async function getContact(req: any, res: Response){
    const contacts = await Post.find();
    res.json({
        ok: true,
        message: 'Contactos obtenidos',
        contacts: contacts
    });
}

// Eliminar Contactos
export async function deleteContact(req: Request, res: Response){
    const { id } = req.params;
    const contact = await Post.findByIdAndDelete(id);

    if (contact && contact.img !== 'uploads\\thumb.jpg') {
        await fs.unlink(path.resolve(contact.img), (err) => {
            if (err) {
                console.error('Error deleting the file:', err);
            } else {
                console.log('File deleted successfully');
            }
        });
    }

    res.json({
        ok: true,
        message: 'Contacto eliminado',
        contact: contact
    });
}

// Actualizar Contactos
export async function updateContact(req: Request, res: Response){
    const { id } = req.params;
    const {
        nombre,
        telefono, 
        correo
    } = req.body;
    const imgPath = req.file ? req.file.path : 'uploads\\thumb.jpg';

    const data = {
        nombre: nombre,
        telefono: telefono,
        img: imgPath,
        correo: correo
    };

    await Post.findByIdAndUpdate(id, data, {new: true}).then((contact) => {
        if(!contact){
            return res.json({
                ok: false,
                message: 'No existe un contacto con ese ID'
            });
        }

        res.json({
            ok: true,
            contact: contact
        });
    });
}

export async function buscaContacto(req: any, res: Response){
    const userId = req.usuario._id;
    const contact = await Post.find({ nombre: { $regex: req.params.nombre, $options: 'i' }, usuario: userId }).then(postDB => {
        res.json({
            ok: true,
            message: 'Contacto encontrado',
            contact: postDB
        });
    }).catch(err => {
        res.json({
            ok: false,
            message: 'Contacto no encontrado',
            err: err
        });
    });;

    
}
    