import app from './app'; 
import { iniciaConexion } from'./database';

async function main(){
    iniciaConexion();
    await app.listen(app.get('port'));
    console.log('Servidor en el puerto: ', app.get('port'));
}

main();
