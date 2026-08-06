import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import 'dotenv/config'

interface RequestWithUser extends Request {
    uid?: string;
    name?: string;
}

const JWT_SEED = process.env.SECRET_JWT_SEED;
if (!JWT_SEED) {
    throw new Error('Falta la variable de entorno SECRET_JWT_SEED');
}

export const validateJWT = (req: RequestWithUser, res: Response, next: NextFunction) => {

    // x-token headers
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token'
        })
    };

    try {
        const { id, name } = jwt.verify(token, JWT_SEED) as { id: string, name: string };

        req.uid = id;
        req.name = name;


    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'token no valido'
        })
    }

    next();

}
