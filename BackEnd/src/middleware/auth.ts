import { Request, Response, NextFunction } from 'express';
import Token from '../Classes/token';
import  Usuario  from '../Models/User.model';

export const verificaToken = (req: any, res: Response, next: NextFunction) => {

    const userToken = req.get('x-token') || '';

    Token.comprobarToken(userToken)
        .then((decoded: any) => {
            console.log('Decoded: ', decoded),
            req.usuario = decoded.usuario;

            next();
        })
        .catch(err => {
            res.json({
                ok: false,
                mensaje: 'Token Incorrecto'
            })
        })

}