import axios, { AxiosError } from "axios";
import { LoginDto, LoginResponseDto } from "../dto/login.dto";
import { normalizeRole } from "../auth/session";
import { Book, Loan } from "../types";

export type ClientResponse<T> = {
    success: boolean;
    data: T;
    statusCode: number;
};

export interface User {
    id: number;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    role?: string;
    active: boolean;
}

// All HTTP calls to Spring backend live here (axios wrapper)
export class LibraryClient {
    private client = axios.create({ baseURL: "http://localhost:8080" });

    constructor() {
        // attach JWT on every request (fixes admin actions after login/refresh)
        this.client.interceptors.request.use((config) => {
            const token = localStorage.getItem("token");
            if (token) {
                config.headers.Authorization = "Bearer " + token;
            }
            return config;
        });
    }

    private apiErrorMessage(error: unknown, fallback: string): string {
        const err = error as AxiosError<{ message?: string }>;
        if (err.response?.status === 403) {
            return err.response.data?.message ?? "Access denied. Log out and log in again as admin.";
        }
        return err.response?.data?.message ?? fallback;
    }

    // spring sometimes returns json as string, this fixes parsing
    private parseLoginBody(data: unknown): LoginResponseDto {
        if (typeof data === "string") {
            return JSON.parse(data) as LoginResponseDto;
        }
        return data as LoginResponseDto;
    }

    // POST /login - saves token + role in localStorage on success
    public async login(data: LoginDto): Promise<ClientResponse<LoginResponseDto | null>> {
        try {
            const response = await this.client.post("/login", data);
            const body = this.parseLoginBody(response.data);
            const token = body.token;

            if (!token) {
                return { success: false, data: null, statusCode: response.status };
            }

            localStorage.setItem("token", token);
            if (body.userId != null) localStorage.setItem("userId", String(body.userId));
            if (body.username) localStorage.setItem("username", body.username);
            if (body.role) localStorage.setItem("role", normalizeRole(body.role) ?? body.role);
            this.client.defaults.headers.common["Authorization"] = "Bearer " + token;

            const normalizedBody = {
                ...body,
                role: normalizeRole(body.role) ?? body.role,
            };
            return { success: true, data: normalizedBody, statusCode: response.status };
        } catch (error) {
            const err = error as AxiosError;
            return { success: false, data: null, statusCode: err.response?.status || 0 };
        }
    }

    // clear session when user logs out
    public logout(): void {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        delete this.client.defaults.headers.common["Authorization"];
    }

    // POST /user/add - new account (signup form)
    public async signup(data: any): Promise<ClientResponse<any>> {
        try {
            const response = await this.client.post("/user/add", data);
            return { success: true, data: response.data, statusCode: response.status };
        } catch (error) {
            const err = error as AxiosError<{ message?: string }>;
            return {
                success: false,
                data: err.response?.data?.message ?? null,
                statusCode: err.response?.status || 0,
            };
        }
    }

    // POST /book/add - librarian only
    public async addBook(data: any): Promise<ClientResponse<any>> {
        try {
            const response = await this.client.post("/book/add", data);
            return { success: true, data: response.data, statusCode: response.status };
        } catch (error) {
            return { success: false, data: null, statusCode: (error as AxiosError).response?.status || 0 };
        }
    }

    // GET /book/getAll - catalogue on first load
    public async getBooks(): Promise<ClientResponse<Book[]>> {
        try {
            const response = await this.client.get("/book/getAll");
            return { success: true, data: response.data, statusCode: response.status };
        } catch (error) {
            return { success: false, data: [], statusCode: (error as AxiosError).response?.status || 0 };
        }
    }

    // GET /book/search?query=...
    public async searchBooks(query: string): Promise<ClientResponse<Book[]>> {
        try {
            const response = await this.client.get(`/book/search?query=${encodeURIComponent(query)}`);
            return { success: true, data: response.data, statusCode: response.status };
        } catch (error) {
            return { success: false, data: [], statusCode: (error as AxiosError).response?.status || 0 };
        }
    }

    // members list for staff/admin
    public async getUsers(): Promise<ClientResponse<User[]>> {
        try {
            const response = await this.client.get("/user/getAll");
            return { success: true, data: response.data, statusCode: response.status };
        } catch (error) {
            return { success: false, data: [], statusCode: (error as AxiosError).response?.status || 0 };
        }
    }

    // filter members by username or email
    public async searchUsers(query: string): Promise<ClientResponse<User[]>> {
        try {
            const response = await this.client.get(`/user/search?query=${encodeURIComponent(query)}`);
            return { success: true, data: response.data, statusCode: response.status };
        } catch (error) {
            return { success: false, data: [], statusCode: (error as AxiosError).response?.status || 0 };
        }
    }

    // librarians waiting for admin approve
    public async getPendingUsers(): Promise<ClientResponse<User[]>> {
        try {
            const response = await this.client.get("/user/pending");
            return { success: true, data: response.data, statusCode: response.status };
        } catch (error) {
            return { success: false, data: [], statusCode: (error as AxiosError).response?.status || 0 };
        }
    }

    // PUT approve - sets active=true
    public async approveUser(id: number): Promise<ClientResponse<string>> {
        try {
            const response = await this.client.put(`/admin/users/${id}/approve`);
            return { success: true, data: String(response.data), statusCode: response.status };
        } catch (error) {
            return { success: false, data: "", statusCode: (error as AxiosError).response?.status || 0 };
        }
    }

    // admin only delete member
    public async deleteUser(id: number): Promise<ClientResponse<string | null>> {
        try {
            await this.client.delete(`/admin/users/${id}`);
            return { success: true, data: null, statusCode: 204 };
        } catch (error) {
            const err = error as AxiosError<{ message?: string }>;
            const message = err.response?.data?.message ?? null;
            return { success: false, data: message, statusCode: err.response?.status || 0 };
        }
    }

    // backend generates random temp password, we show it in alert
    public async resetPassword(id: number): Promise<ClientResponse<string>> {
        try {
            const response = await this.client.put(`/admin/users/${id}/reset-password`);
            return { success: true, data: String(response.data), statusCode: response.status };
        } catch (error) {
            return { success: false, data: "", statusCode: (error as AxiosError).response?.status || 0 };
        }
    }

    // toggle READER <-> LIBRARIAN
    public async changeRole(id: number, newRole: string): Promise<ClientResponse<string>> {
        try {
            const response = await this.client.put(`/admin/users/${id}/role?newRole=${newRole}`);
            return { success: true, data: String(response.data), statusCode: response.status };
        } catch (error) {
            return { success: false, data: "", statusCode: (error as AxiosError).response?.status || 0 };
        }
    }

    // admin edits copies on shelf from catalogue
    public async updateBookStock(id: number, copies: number): Promise<ClientResponse<Book | null>> {
        try {
            const response = await this.client.put(`/admin/books/${id}/stock?copies=${copies}`);
            return { success: true, data: response.data, statusCode: response.status };
        } catch (error) {
            return { success: false, data: null, statusCode: (error as AxiosError).response?.status || 0 };
        }
    }

    // remove book from catalog (blocked if still borrowed)
    public async deleteBook(id: number): Promise<ClientResponse<string | null>> {
        try {
            await this.client.delete(`/admin/books/${id}`);
            return { success: true, data: null, statusCode: 204 };
        } catch (error) {
            return {
                success: false,
                data: this.apiErrorMessage(error, "Could not delete book."),
                statusCode: (error as AxiosError).response?.status || 0,
            };
        }
    }

    // PUT /admin/books/{id} - admin only, fix title/author etc
    public async updateBook(id: number, data: {
        title: string;
        author: string;
        publisher: string;
        year: number;
        availableCopies: number;
    }): Promise<ClientResponse<Book | null>> {
        try {
            const response = await this.client.put(`/admin/books/${id}`, data);
            return { success: true, data: response.data, statusCode: response.status };
        } catch (error) {
            return { success: false, data: null, statusCode: (error as AxiosError).response?.status || 0 };
        }
    }

    // admin updates contact info only - no password/username
    public async updateMemberProfile(id: number, data: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
    }): Promise<ClientResponse<User | null>> {
        try {
            const response = await this.client.put(`/admin/users/${id}/profile`, data);
            return { success: true, data: response.data, statusCode: response.status };
        } catch (error) {
            return { success: false, data: null, statusCode: (error as AxiosError).response?.status || 0 };
        }
    }

    // POST /loan/add - reader borrows from catalog
    public async borrowBook(bookID: number, userID: number): Promise<ClientResponse<Loan | null>> {
        try {
            const response = await this.client.post("/loan/add", { bookID, userID });
            return { success: true, data: response.data, statusCode: response.status };
        } catch (error) {
            return { success: false, data: null, statusCode: (error as AxiosError).response?.status || 0 };
        }
    }

    // GET /loan/myHistory - my loans page
    public async getMyLoans(): Promise<ClientResponse<Loan[]>> {
        try {
            const response = await this.client.get("/loan/myHistory");
            return { success: true, data: response.data, statusCode: response.status };
        } catch (error) {
            return { success: false, data: [], statusCode: (error as AxiosError).response?.status || 0 };
        }
    }

    // desk returns page - all loans in system
    public async getAllLoans(): Promise<ClientResponse<Loan[]>> {
        try {
            const response = await this.client.get("/loan/getAll");
            return { success: true, data: response.data, statusCode: response.status };
        } catch (error) {
            return { success: false, data: [], statusCode: (error as AxiosError).response?.status || 0 };
        }
    }

    // librarian clicks return at desk
    public async returnBook(loanId: number): Promise<ClientResponse<Loan | null>> {
        try {
            const response = await this.client.put(`/loan/return/${loanId}`);
            return { success: true, data: response.data, statusCode: response.status };
        } catch (error) {
            return { success: false, data: null, statusCode: (error as AxiosError).response?.status || 0 };
        }
    }
}
