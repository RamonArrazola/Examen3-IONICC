import { Router } from 'express';
// import { createPhoto, obtenerPhoto, obtenerPhotoById, eliminaPhoto, updatePhoto } from '../Controllers/photo.controller';
import multer from '../Libs/multer';
import { LoginUsr, SignUp, UpdateUsr,
         obtieneData, validaEmail } from '../Controllers/user.controller';
import { verificaToken } from '../middleware/auth';
import { deleteContact, createContact, getContact,
         updateContact, buscaContacto } from '../Controllers/contact.controller';

const router = Router();

// router.route('/photo')
//         .get(obtenerPhoto)
//         .post(multer.single('image'), createPhoto); //single es para subir una sola imagen, 'image' es el nombre del campo que se va a subir

// router.route('/photo/:id')
//         .get(obtenerPhotoById)
//         .delete(eliminaPhoto)
//         .put(updatePhoto);

// Rutas de Usuario 

router.route('/user/login').post(LoginUsr);                             //Login de usuario
router.route('/user/create').post(multer.single('avatar'), SignUp);     //Registro de usuario
router.route('/user/update').put(multer.single('img'),
                                 [verificaToken],   
                                 UpdateUsr);                            //Actualizar usuario
router.route('/user/existe').get(validaEmail);                          //Validar si el correo existe
router.route('/user').get([verificaToken], obtieneData);                //Obtener datos del usuario


// Rutas de Contacto
router.route('/post/').post(multer.single('img'),                       //Crear Contacto
                            [verificaToken],
                            createContact);   
router.route('/post/').get([verificaToken], getContact);                //Obtener Contactos
router.route('/post/:id').delete([verificaToken], deleteContact);       //Eliminar Contacto
router.route('/post/:id').put([verificaToken], updateContact);          //Actualizar Contacto
router.route('/post/:nombre').get([verificaToken], buscaContacto);      //Buscar Contacto

export default router;