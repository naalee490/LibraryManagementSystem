export interface SignupDto {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    username: string;
    password: string;
    role?: string; //optional (we force it to 'user')
}