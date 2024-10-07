import { Router, Response, Request } from "express";
import { verificaToken } from "../middlewares/auth";
import { Post } from "../models/post.model";
import { FileUpload } from "../interfaces/file-upload";
import FileSystem from "../classes/FileSystem";
import { Usuario } from '../models/user.model';

const PostRoutes = Router();
const fileSys: FileSystem = new FileSystem();

// Crear Contactos

PostRoutes.post('/', [verificaToken], (req: any, res: Response) => {

    const body = req.body;
    body.usuario = req.usuario._id;

    const images = fileSys.TempToPost(req.usuario._id);
    body.img = images;

    Post.create( body ).then( async postDB => {


        await postDB.populate('usuario', '-password'); //Ya no hay necesidad de usar execPopulate()

        res.json({
            ok: true,
            post: postDB
        });

    }).catch(err => {

        res.json(err);
    });

});


// Obtener Contactos por Paginas
PostRoutes.get('/', [verificaToken], async (req: any, res: Response) => {

    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina -1; 
    skip = skip * 10;
    const nombre =  '';
    const tok = req.get('x-token');

    const posts = await Post.find({ usuario: req.usuario._id, nombre: { $regex: nombre, $options: 'i' } })
                            // .sort({_id: -1})
                            .limit(10)
                            .populate('nombre', '-password')
                            .skip( skip )
                            .exec();

    res.json({
        ok: true,
        pagina,
        posts
    });

});

// Servicio para agregar imagenes de Contacto
PostRoutes.post('/upload', [verificaToken], async (req: any, res: Response) => {

    const file: FileUpload = req.files.image;

    if (!file){
        res.status(400).json({
            ok: false,
            message: 'No se subió ningún archivo - image'
        });
    }

    if(!req.files){
        res.status(400).json({
            ok: false,
            message: 'No se subió ningún archivo'
        });
    }

    if(!file.mimetype.includes('image')){
        res.status(400).json({
            ok: false,
            message: 'Lo que subió no es una imagen'
        });
    }

    await fileSys.SaveTempImage(file, req.usuario._id);

    res.json({
        ok: true,
        file: file.mimetype
    });
});

// Servicio para Mostrar Imagenes en FrontEnd
PostRoutes.get(`/imagen/:userId/:img`, (req: any, res: Response) => {
    const userId = req.params.userId;
    const img = req.params.img;

    const pathImg = fileSys.GetImgUrl(userId, img);

    res.sendFile(pathImg);
});

PostRoutes.get(`/busca`, [verificaToken], (req: any, res: Response) => {
    const search = req.query.nombre;
    const userId = req.usuario._id;

    Post.find({ nombre: { $regex: search, $options: 'i' }, usuario: userId }).then(postDB => {

        res.json({
            ok: true,
            post: postDB
        });
    }).catch(err => {
        res.json(err);
    }); 
});

PostRoutes.delete('/delete', [verificaToken], (req: any, res: Response) => {
    const id = req.query.id;

    Post.findByIdAndDelete(id).then(postDB => {
        res.json({
            ok: true,
            post: postDB
        });
    }).catch(err => {
        res.json(err);
    });
});

export default PostRoutes;