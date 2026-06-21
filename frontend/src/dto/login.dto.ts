export class LoginDto {
    username: string | undefined;
    password: string | undefined;
}

export class LoginResponseDto {
    token?: string;
    userId?: number;
    username?: string;
    role?: string;
}
