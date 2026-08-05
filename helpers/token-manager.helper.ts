import { User } from "../generated/prisma/client";
import { JsonWebTokenService } from "../services/jwt.service";

const jtwService = new JsonWebTokenService()


// Validacion de si existen valores en el ENV
const rawSession = process.env.SESSION_TOKEN_DURATION_IN_MINUTES
const rawRefresh = process.env.REFRESH_TOKEN_DURATION_IN_HOURS

const normalizeDuration = (value: string | undefined, unit: 'm' | 'h', fallback: string) => {
    if (!value) return fallback
    // If the value is purely numeric, append the unit (minutes -> 'm', hours -> 'h')
    if (/^\d+$/.test(value)) return `${value}${unit}`
    // Otherwise assume the user provided a valid format like '15m' or '360h'
    return value
}

const tokenSessionDuration = normalizeDuration(rawSession, 'm', '15m')
const tokenRefreshDuration = normalizeDuration(rawRefresh, 'h', '360h')


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