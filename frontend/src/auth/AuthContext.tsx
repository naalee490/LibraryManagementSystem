import React, { createContext, ReactNode, useContext, useMemo } from "react";
import { getSessionUserId, isAdminRole, normalizeRole } from "./session";

export type AuthContextValue = {
    role: string | null;
    userId: number | null;
    isLoggedIn: boolean;
    isAdmin: boolean;
    isStaff: boolean;
    canBorrow: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

// who is logged in + what they can do (borrow, see admin stuff etc.)
export function AuthProvider({ role, children }: { role: string | null; children: ReactNode }) {
    const value = useMemo((): AuthContextValue => {
        const normalizedRole = role ? normalizeRole(role) : null;
        const userId = normalizedRole ? getSessionUserId() : null;
        return {
            role: normalizedRole,
            userId,
            isLoggedIn: !!normalizedRole,
            isAdmin: isAdminRole(normalizedRole),
            isStaff: normalizedRole === "ROLE_LIBRARIAN" || normalizedRole === "ROLE_ADMIN",
            canBorrow: !isAdminRole(normalizedRole)
                && (normalizedRole === "ROLE_READER" || normalizedRole === "ROLE_LIBRARIAN")
                && userId != null,
        };
    }, [role]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// hook for any component that needs role / userId
export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return ctx;
}
