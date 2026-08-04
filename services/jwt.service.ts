import jwt from 'jsonwebtoken';
require('dotenv').config()



export class JsonWebTokenService {

    generarJWT = async (id: string, name: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            const payload = {
                id,
                name
            };

            jwt.sign(payload, process.env.SECRET_JWT_SEED as jwt.Secret, {
                expiresIn: '2h',
            }, (err, token) => {
                if (err) {
                    console.log(err)
                    reject('An error was ocurred')
                }
                resolve(token as string);
            });

        })


    }

}