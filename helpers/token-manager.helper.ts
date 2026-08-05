import { User } from "../generated/prisma/client";
import { JsonWebTokenService } from "../services/jwt.service";

const jtwService = new JsonWebTokenService()


// Validacion de si existen valores en el ENV
const tokenSessionDuration = process.env.SESSION_TOKEN_DURATION_IN_MINUTES || '15m'
const tokenRefreshDuration = process.env.REFRESH_TOKEN_DURATION_IN_HOURS || '360h'


export const tokenManager = async (user: User): Promise<{ sessionToken: string, refreshToken: string }> => {
    // Darle token de sesión al usuario al usuario
    const token = await jtwService.generarJWT(user.id, user.name, user.role, tokenSessionDuration)

    // Generar "refreshToken" y guardarlo en la base de datos
    const refreshToken = await jtwService.generarJWT(user.id, user.name, user.role, tokenRefreshDuration)

    return {
        sessionToken: token,
        refreshToken: refreshToken
    }
}