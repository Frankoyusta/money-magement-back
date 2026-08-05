import { Request, Response } from "express";
import authService from '../services/auth.service';

export const loginController = async (req: Request, res: Response) => {
    const { email, password } = req.body
    const response = await authService.login(email, password);

    if (response.codeError) {
        const code = response.codeError
        return res.status(code).json({
            ok: false,
            msg: response.msg
        })
    }

    res.status(200).json({
        ok: true,
        token: response.token,
        user: response.user
    })

}


export const registerController = async (req: Request, res: Response) => {
    const { email, password, name } = req.body
    const response = await authService.register(email, password, name);
    if (response.codeError) {
        const code = response.codeError
        return res.status(code).json({
            ok: false,
            msg: response.msg
        })
    }

    res.status(200).json({
        ok: true,
        token: response.token,
        user: response.user

    })
};



export const checkController = async (req: Request, res: Response) => {
    const token = req.header('Authorization')
    if (!token) {
        res.status(401).json({
            ok: false,
            msg: 'Token no valido'

        })
        return;
    }

    const response = await authService.renew(token);

    return res.status(200).json({
        ok: true,
        user: response.user,
        token: response.token
    });
}




