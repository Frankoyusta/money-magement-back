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
        name: response.name,
        id: response.id
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
        name: response.name,
        id: response.id
    })
};



// export const renewController = async (req: Request, res: Response) => {
//     const { token } = req.body
//     const response = await authService.renew(token);
// }




