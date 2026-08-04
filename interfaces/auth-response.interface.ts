export interface AuthResponse {
    id: string;
    name: string;
    token: string;
    codeError?: Number;
    msg?: string;
}