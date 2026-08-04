import { User } from "../generated/prisma/client";
import { AuthResponse } from "../interfaces/auth-response.interface";
import { UserRepository } from "../repositories/user.repository"
import { HashService } from "./hash.service";
import { JsonWebTokenService } from "./jwt.service";
const userRepository = new UserRepository()
const hashService = new HashService()
const jtwService = new JsonWebTokenService()

const login = async (email: string, password: string): Promise<AuthResponse | undefined> => {
    try {
        console.log('Hola')
        // Validar que exista un usuario con ese correo
        const user = await userRepository.findUserByEmail(email);
        if (!user) {
            return undefined
        }

        // Como se que existe el usuario, vamos a comparar la contraseña
        const isValid = hashService.verify(password, user.password)
        if (!isValid) {
            return undefined
        }
        // Darle token de acceso al usuario
        const token = await jtwService.generarJWT(user.id, user.name)
        return {
            token,
            name: user.name,
            id: user.id
        }
    } catch (error) {
        return undefined
    }
}


const register = async (email: string, password: string, name: string): Promise<AuthResponse | null> => {

    // Validar que exista un usuario con ese correo
    const userExists = await userRepository.findUserByEmail(email);
    if (userExists) {
        return null
    }

    // Si no existe, hashear la contraseña
    const hashedPassword = hashService.hash(password)

    const user = await userRepository.createOrUpdateUser(email, hashedPassword, name)

    // Darle token de acceso al usuario
    const token = await jtwService.generarJWT(user.id, user.name)
    return {
        token,
        name: user.name,
        id: user.id
    }
}


export default {
    login,
    register
}