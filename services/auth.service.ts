import { User } from "../generated/prisma/client";
import { tokenManager } from "../helpers/token-manager.helper";
import { AuthResponse } from "../interfaces/auth-response.interface";
import { UserRepository } from "../repositories/user.repository"
import { HashService } from "./hash.service";
import 'dotenv/config'
import { JsonWebTokenService } from "./jwt.service";

// Definición de repositorios
const userRepository = new UserRepository()
const hashService = new HashService()
const jtwService = new JsonWebTokenService()



const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
        // Validar que exista un usuario con ese correo
        const user = await userRepository.findUserByEmail(email);
        if (!user) {
            return {
                codeError: 401,
                msg: 'Credenciales incorrectas'
            }
        }

        // Como se que existe el usuario, vamos a comparar la contraseña
        const isValid = hashService.verify(password, user.password)
        if (!isValid) {
            return {
                codeError: 401,
                msg: 'Credenciales incorrectas'
            }
        }

        const { refreshToken, sessionToken } = await tokenManager(user)

        // Guardar refreshToken
        await userRepository.saveRefreshToken(user.id, refreshToken);

        return {
            token: sessionToken,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
                email: user.email
            }
        }
    } catch (error) {
        console.log(error)
        return {
            codeError: 500,
            msg: 'Error en el servidor'

        }
    }
}


const register = async (email: string, password: string, name: string): Promise<AuthResponse> => {

    try {
        // Validar que exista un usuario con ese correo
        const userExists = await userRepository.findUserByEmail(email);
        if (userExists) {
            return {
                codeError: 409,
                //Este mensaje se coloca solo para "guiar" en desarrollo,  ya que si se coloca en porduccion da indicios de que el usuario existe.
                msg: 'Usuario ya existe'
            }
        }

        // Si no existe, hashear la contraseña
        const hashedPassword = hashService.hash(password)


        // Crear usuario
        const user = await userRepository.createUser(email, hashedPassword, name)

        // Crear token 
        const { refreshToken, sessionToken } = await tokenManager(user)

        // Guardar refreshToken
        const a = await userRepository.saveRefreshToken(user.id, refreshToken);

        return {
            token: sessionToken,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
                email: user.email
            }
        }
    } catch (error) {
        return {
            codeError: 500,
            msg: 'Error en el servidor'

        }
    }
};


const renew = async (token: string) => {
    try {
        const payload = await jtwService.checkJWT(token); // verifica firma + expiración
        return { token, user: payload };
    } catch (error) {
        return { codeError: 401, msg: 'Token inválido o expirado' };
    }
}


const refresh = async (token: string) => {
    try {
        // Verificar firma y expiracion del refreshToken
        const payload = await jtwService.checkJWT(token);

        if (!payload) {
            return {
                codeError: 401,
                msg: 'Token inválido o expirado.'
            };
        }

        if (typeof payload === 'string' || !('id' in payload)) {
            return {
                codeError: 401,
                msg: 'Token inválido o expirado.'
            };
        }

        const user = await userRepository.findUserById(payload.id);

        if (!user) {
            return {
                codeError: 401,
                msg: 'Token inválido o expirado'
            };
        };

        if (token !== user.refreshToken) {
            return {
                codeError: 401,
                msg: 'Token inválido o expirado`'
            };
        };

        const newToken = await jtwService.generarJWT(user.id, user.name, user.role, '15m')


        return { newToken, user: user };
    } catch (error) {
        return { codeError: 401, msg: 'Token inválido o expirado' };
    }
}



export default {
    login,
    register,
    renew,
    refresh,
}