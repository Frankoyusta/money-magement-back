import jwt, { SignOptions } from 'jsonwebtoken';
import 'dotenv/config'


const JWT_SEED = process.env.SECRET_JWT_SEED;
if (!JWT_SEED) {
    throw new Error('Falta la variable de entorno SECRET_JWT_SEED');
}

export class JsonWebTokenService {

    generarJWT = async (id: string, name: string, role: string, duration: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            const payload = {
                id,
                name,
                role
            };

            jwt.sign(payload, JWT_SEED as string, {
                expiresIn: duration as SignOptions['expiresIn'],
            }, (err, token) => {
                if (err) {
                    console.log(err)
                    return reject(new Error('Error al generar el token'))
                }
                return resolve(token as string);
            });

        })
    }

    checkJWT = async (token: string) => {
        const verify = jwt.verify(token, JWT_SEED as jwt.Secret);
        return verify
    }

}