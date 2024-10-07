import { Router, Request, Response} from 'express';
import { Usuario } from '../models/user.model';
import bcrypt from 'bcrypt';
import Token from '../classes/token';
import { verificaToken } from '../middlewares/auth';

const userRoutes = Router();

//Login

userRoutes.post('/login', (req: Request, res: Response) => {
    const body = req.body;

    Usuario.findOne({ email: body.email }).then((userDB: any) => {
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'Usuario/contraseña no son correctos'
            });
        }

        if (userDB.comparePass(body.password)) {

            const tokenUsr = Token.getJwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                avatar: userDB.avatar
            });

            res.json({
                
                ok: true,
                token: tokenUsr
            });
        } else {
            res.json({
                ok: false,
                mensaje: 'Usuario/contraseña no son correctos*'
            });
        }
    }).catch((err: any) => {
        res.json({
            ok: false,
            err: err
        });
    });
})


//Crear un usuario 

userRoutes.post('/create', (req: Request, res: Response) =>{

    const user = {
        nombre: req.body.nombre,
        email: req.body.email,
        password:  bcrypt.hashSync(req.body.password, 10),
        avatar: req.body.avatar
    }

    Usuario.create(user).then(userDB => {

        const tokenUsr = Token.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
        });

        res.json({
            ok: true,
            token: tokenUsr
        });

    }).catch(err => {
        res.json({
            ok: false,
            err: err
        });
    })
});


//Actualizacion de Usuario 

userRoutes.post('/update', verificaToken, (req: any, res: Response) => {

    const user = {
        nombre: req.body.nombre || req.usuario.nombre, 
        email: req.body.email || req.usuario.email, 
        avatar: req.body.avatar || req.usuario.avatar
    }

    Usuario.findByIdAndUpdate(req.usuario._id, user, { new: true })
    .then(userDB => {
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'No existe un usuario con ese ID'
            });
        }

        const tokenUsr   = Token.getJwtToken({
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
    })
    .catch(err => {
        throw err;
    });
});

userRoutes.get('/', [verificaToken], (req: any, res: Response) => {
    const usuario = req.usuario;

    res.json({
        ok: true,
        usuario
    });
});

userRoutes.get('/existe', (req: any, res: Response) => {
    const email = req.query.email;
        Usuario.find({email: {$regex: email, $options: 'i'}}).then(userDB => {
        if (userDB) {
            return res.json({
                ok: true,
                mensaje: 'El correo ya está registrado'
            });
        } else {
            return res.json({
                ok: false,
                mensaje: 'El correo no está registrado'
            });
        }
    });
});
    

export default userRoutes;