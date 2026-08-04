import { Request, Response } from "express";
import authService from '../services/auth.service';

export const loginController = async (req: Request, res: Response) => {
    const { email, password } = req.body
    const response = await authService.login(email, password);
    response === undefined ?
        res.status(500).json({
            ok: false,
            msg: ''
        }) : res.status(200).json({
            ok: true,
            token: response.token,
            name: response.name,
            id: response.id
        })

}


export const registerController = async (req: Request, res: Response) => {
    const { email, password, name } = req.body
    const response = await authService.register(email, password, name);
    response === null ?
        res.status(500).json({
            ok: false,
            msg: ''
        }) : res.status(200).json({
            ok: true,
            token: response.token,
            name: response.name,
            id: response.id
        })
}




