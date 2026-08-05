import { User } from "../generated/prisma/client";
import { tokenManager } from "../helpers/token-manager.helper";
import { AuthResponse } from "../interfaces/auth-response.interface";
import { UserRepository } from "../repositories/user.repository"
import { HashService } from "./hash.service";
import 'dotenv/config'

// Definición de repositorios
const userRepository = new UserRepository()
const hashService = new HashService()


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
        userRepository.saveRefreshToken(user.id, refreshToken);

        return {
            token: sessionToken,
            name: user.name,
            id: user.id
        }
    } catch (error) {
        console.log(error)
        return {
            token: '',
            name: '',
            id: '',
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
            name: user.name,
            id: user.id
        }
    } catch (error) {
        return {
            codeError: 500,
            msg: 'Error en el servidor'

        }
    }
};




export default {
    login,
    register
}