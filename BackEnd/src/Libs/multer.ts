import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const storage = multer.diskStorage({                                    //configuracion para decir donde se guardaran las imagenes
    destination: 'uploads',                                             //carpeta donde se guardaran las imagenes
    filename: (req, file, cb) => {                                      //definir el nombre de la imagen 
        cb(null, uuidv4() + path.extname(file.originalname));           //nombre de la imagen
        console.log('multer '+file);
    }
}) 

export default multer({ storage });                                   //Cuando exportemos multer, ya estara lista la funcion storage para guardar las imagenes