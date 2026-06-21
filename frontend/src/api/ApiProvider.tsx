import React, { createContext, ReactNode, useContext, useMemo } from "react";
import { LibraryClient } from "../library-client/library-client";

export const ApiContext = createContext<LibraryClient | null>(null);

// one shared LibraryClient for whole app (so JWT header stays in sync)
export default function ApiProvider({ children }: { children: ReactNode }) {
    const apiClient = useMemo(() => new LibraryClient(), []);

    return (
        <ApiContext.Provider value={apiClient}>
            {children}
        </ApiContext.Provider>
    );
}

export function useApi(): LibraryClient {
    // shortcut so components dont import context directly
    const client = useContext(ApiContext);
    if (!client) {
        throw new Error("useApi must be used inside ApiProvider");
    }
    return client;
}
