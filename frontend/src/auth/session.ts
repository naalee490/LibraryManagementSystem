/** Only trust role if JWT exists too (fixes weird state after logout). */
export function normalizeRole(role: string | null | undefined): string | null {
    if (!role) return null;
    const trimmed = role.trim().toUpperCase();
    return trimmed.startsWith("ROLE_") ? trimmed : `ROLE_${trimmed}`;
}

export function getSessionRole(): string | null {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || !role) return null;
    return normalizeRole(role);
}

// user id from login response, needed for borrow
export function getSessionUserId(): number | null {
    if (!localStorage.getItem("token")) return null;
    const id = Number(localStorage.getItem("userId"));
    return Number.isFinite(id) && id > 0 ? id : null;
}

// on app start - remove role if token is gone
export function clearStaleSession(): void {
    if (!localStorage.getItem("token")) {
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
    }
}

export function isAdminRole(role: string | null | undefined): boolean {
    return normalizeRole(role) === "ROLE_ADMIN";
}
