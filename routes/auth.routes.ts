import { Router } from 'express';
import { loginController, registerController } from '../controllers/auth.controller';
import { check } from 'express-validator';
import { fieldValidator } from '../middlewares/fields-validator';

export const router = Router();


router.post('/login',
    [ //Middlewares
        check('email', 'El campo email es obligatorio').isEmail(),
        check('password', 'El campo contraseña debe de ser de 6 caracteres').isLength({ min: 6 }),
        fieldValidator
    ], loginController);


router.post('/register',
    [ //Middlewares
        check('name', 'El campo nombre es obligatorio').not().isEmpty(),
        check('email', 'El campo email es obligatorio').isEmail(),
        check('password', 'El campo contraseña debe de ser de 6 caracteres').isLength({ min: 6 }),
        fieldValidator
    ],
    registerController);

