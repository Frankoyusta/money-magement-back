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


    res.cookie('refreshToken', response.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 24 * 60 * 60 * 1000 // 15 días
    });

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

    res.cookie('refreshToken', response.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 24 * 60 * 60 * 1000 // 15 días
    });

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
    if (response.codeError) {
        return res.status(response.codeError).json({ ok: false, msg: response.msg });
    }
    return res.status(200).json({
        ok: true,
        user: response.user,
        token: response.token
    });

}


export const refreshController = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ ok: false, msg: 'No hay refresh token' });
    }

    const response = await authService.refresh(refreshToken);

    if (!response || response.codeError) {
        return res.status(response.codeError).json({
            ok: false,
            msg: response.msg
        })
    }
    return res.status(200).json({
        ok: true,
        token: response.newToken,
        user: {
            id: response.user?.id,
            name: response.user?.name,
            role: response.user?.role,
            email: response.user?.email
        }
    })
}




