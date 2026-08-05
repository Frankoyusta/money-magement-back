import jwt, { SignOptions } from 'jsonwebtoken';
import 'dotenv/config'


const JWT_SEED = process.env.SECRET_JWT_SEED;
if (!JWT_SEED) {
    throw new Error('Falta la variable de entorno SECRET_JWT_SEED');
}

export class JsonWebTokenService {

    generarJWT = async (id: string, name: string, role: string, duration: string): Promise<string> => {
        try {
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
        } catch (error) {
            console.log(error)
            return ''
        }
    }

    checkJWT = async (token: string) => {
        try {
            const verify = jwt.verify(token, JWT_SEED as jwt.Secret);
            return verify
        } catch (error) {
            console.log(error)
        }
    }

    decodeJWT = async (token: string) => {
        const payload = jwt.decode(token);
        return payload
    }

}