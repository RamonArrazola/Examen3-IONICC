import { Request, Response } from 'express';
import Usuario from '../Models/User.model';
import bcrypt from 'bcrypt';
import Token from '../Classes/token';
import fs from 'fs';
import path from 'path';

export async function LoginUsr(req: Request, res: Response){
    console.log(req.body);
    const {email, password} = req.body                                  //Obtener los datos de tipo txt del body
    const user = {
        email: email,
        password: password
    }                                                                   //Obtenemos los datos desde el FrontEnd

    await Usuario.findOne({email: user.email}).then((userDb: any) =>{   //Buscamos el usuario por el email
        if(!userDb){
            return res.json({
                ok: false,
                message: 'Usuario/Contraseña no son correctos'
            });
        }
        if(userDb.comparePass(user.password)){
            const tokenUsr = Token.getJwtToken({                        //Generamos el token
                _id: userDb._id,
                nombre: userDb.nombre,
                email: userDb.email,
                avatar: userDb.avatar
            });
            res.json({
                ok: true,
                token: tokenUsr
            });
        } else {
            return res.json({
                ok: false,
                message: 'Usuario/Contraseña no son correctos***'
            });
        }
    }).catch((err: any) => {
        res.json({
            ok: false,
            err: err
        });
    });   
}

export async function SignUp(req: Request, res: Response){
    const { nombre, email } = req.body;                                 //Obtenemos los datos del body 
    const imgPath  = req.file ? req.file.path : 'uploads\\thumb.jpg'    //Obtener el avatar del usuario, si no se ingresas uno, se asigna uno por defecto                  
    const pass = bcrypt.hashSync(req.body.password, 10);                //Encriptamos la contraseña

    const newUser = {
        nombre: nombre,
        email: email,
        password: pass,
        avatar: imgPath
    }

    await Usuario.create(newUser).then((userDB: any) => {               // Creamos el usuario en la DB
        const tokenUsr = Token.getJwtToken({                            //Generamos el token
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
        }); 

        res.json({
            ok: true,
            token: tokenUsr
        });
    }).catch((err:any) => {
        res.json({
            ok: false,
            err: err
        });
        if(newUser.avatar !== 'uploads\\thumb.jpg'){                    //Si el avatar no es el por defecto, lo eliminamos
            fs.unlink(path.resolve(newUser.avatar), (err) => {
                if (err) { console.error('Error deleting the file:', err); }
            })
        }
    });
}

export async function UpdateUsr(req: any, res: Response){
    const data = {                                                      //Obtenemos los datos del body o del token
        nombre: req.body.nombre || req.usuario.nombre,
        email: req.body.email || req.usuario.email,
        avatar: req.file ? req.file.path : req.usuario.avatar
    }
    console.log(data.avatar);
    console.log(req.usuario.avatar);

    await Usuario.findByIdAndUpdate(req.usuario._id, data, {new: true}).then((userDB: any) => { //Actualizamos los datos del usuario
        if(!userDB){
            return res.json({
                ok: false,
                message: 'No existe un usuario con ese ID'
            });
        }

        const tokenUsr = Token.getJwtToken({                            //Generamos el token
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
        });

        res.json({
            ok: true,
            user: userDB,
            token: tokenUsr
        }); 
    });
}

export async function obtieneData(req: any, res: Response){
    const user = req.usuario;                                            //Obtenemos los datos del token
    console.log(user);
    res.json({
        ok: true,
        user: user
    });
};

export async function validaEmail (req: Request, res: Response){
    const email = req.query.email;                                      //Obtenemos el email desde la peticion
    await Usuario.findOne({email: { $regex: email, $options: 'i'}}).then((userDB: any) => {
        if(userDB.length > 0){
            return res.json({
                ok: false,
                message: 'Email ya registrado'
            });
        } else {
            return res.json({
                ok: true,
                message: 'Email disponible'
            });
        }
    })
}
    
    