import jwt from 'jsonwebtoken';
import 'dotenv/config'


const JWT_SEED = process.env.SECRET_JWT_SEED;
if (!JWT_SEED) {
    throw new Error('Falta la variable de entorno SECRET_JWT_SEED');
}

export class JsonWebTokenService {

    generarJWT = async (id: string, name: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            const payload = {
                id,
                name
            };

            jwt.sign(payload, JWT_SEED as jwt.Secret, {
                expiresIn: '2h',
            }, (err, token) => {
                if (err) {
                    console.log(err)
                    return reject(new Error('Error al generar el token'))
                }
                return resolve(token as string);
            });

        })


    }

}