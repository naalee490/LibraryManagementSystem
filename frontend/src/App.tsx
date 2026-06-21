import React, { useState, useEffect } from "react";
import "./App.css";
import { Container, CssBaseline } from "@mui/material";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import AddBookForm from "./addbook-form/AddBookForm";
import LoginForm from "./login-form/LoginForm";
import SignupForm from "./signupform/SignupForm";
import UserList from "./user-list/UserList";
import BookListView from "./book-list/BookListView";
import MyLoansView from "./my-loans/MyLoansView";
import AllLoansView from "./loans-all/AllLoansView";
import ApiProvider from "./api/ApiProvider";
import AdminPanel from "./admin-panel/AdminPanel";
import { AuthProvider } from "./auth/AuthContext";
import { clearStaleSession, getSessionRole, normalizeRole } from "./auth/session";

// root component - routes change based on whos logged in
function App() {
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        clearStaleSession(); // fix leftover role without token
        setRole(getSessionRole());
    }, []);

    // navbar calls this after api.logout()
    const handleLogout = () => {
        setRole(null);
    };

    const isLoggedIn = !!role;
    const normalizedRole = normalizeRole(role);
    const isStaff = normalizedRole === "ROLE_LIBRARIAN" || normalizedRole === "ROLE_ADMIN";
    const isAdmin = normalizedRole === "ROLE_ADMIN";

    return (
        <BrowserRouter>
            <CssBaseline />
            <ApiProvider>
                <AuthProvider role={role}>
                    <div className="App">
                        <Navbar currentRole={role} onLogout={handleLogout} />

                        <Container sx={{ mt: 4, pb: 4 }}>
                            <Routes>
                                <Route path="/" element={<BookListView />} />
                                <Route path="/catalog" element={<BookListView />} />
                                <Route path="/login" element={<LoginForm setRole={setRole} />} />
                                <Route path="/signup" element={<SignupForm />} />

                                {(normalizedRole === "ROLE_READER" || normalizedRole === "ROLE_LIBRARIAN") && (
                                    <Route path="/my-loans" element={<MyLoansView />} />
                                )}

                                {isStaff && (
                                    <>
                                        <Route path="/users" element={<UserList />} />
                                        <Route path="/add-book" element={<AddBookForm />} />
                                        <Route path="/all-loans" element={<AllLoansView />} />
                                    </>
                                )}

                                {isAdmin && (
                                    <Route path="/admin" element={<AdminPanel />} />
                                )}

                                <Route path="*" element={<Navigate to="/" />} />
                            </Routes>
                        </Container>
                    </div>
                </AuthProvider>
            </ApiProvider>
        </BrowserRouter>
    );
}

export default App;
