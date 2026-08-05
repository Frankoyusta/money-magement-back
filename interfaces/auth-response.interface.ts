
export interface AuthResponse {
    user?: UserToResponse
    token?: string;
    refreshToken?: string;
    codeError?: number;
    msg?: string;
}


interface UserToResponse {
    name: string;
    id: string;
    email: string;
    role: string;
}