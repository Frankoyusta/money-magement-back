export interface AuthResponse {
    id: string;
    name: string;
    token: string;
    codeError?: number;
    msg?: string;
}