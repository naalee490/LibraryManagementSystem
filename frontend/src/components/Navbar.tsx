import { Link as RouterLink, useNavigate } from "react-router-dom";
import { AppBar, Box, Button, Toolbar } from "@mui/material";
import { useApi } from "../api/ApiProvider";

interface NavbarProps {
    currentRole: string | null;
    onLogout: () => void;
}

const linkSx = { color: "inherit", fontWeight: 600, letterSpacing: "0.04em" };

// top navigation - MUI AppBar, links depend on role
function Navbar({ currentRole, onLogout }: NavbarProps) {
    const navigate = useNavigate();
    const api = useApi();

    // logout btn - wipe token then go login page
    const handleLogoutClick = () => {
        api.logout(); // clears localStorage + axios header
        onLogout();
        navigate("/login");
    };

    const isStaff = currentRole === "ROLE_LIBRARIAN" || currentRole === "ROLE_ADMIN";

    return (
        <AppBar position="static" sx={{ mb: 3 }}>
            <Toolbar sx={{ flexWrap: "wrap", gap: 0.5 }}>
                <Button component={RouterLink} to="/catalog" sx={linkSx}>CATALOG</Button>

                {(currentRole === "ROLE_READER" || currentRole === "ROLE_LIBRARIAN") && (
                    <Button component={RouterLink} to="/my-loans" sx={linkSx}>MY LOANS</Button>
                )}

                {isStaff && (
                    <>
                        <Button component={RouterLink} to="/users" sx={linkSx}>MEMBERS</Button>
                        {currentRole === "ROLE_LIBRARIAN" && (
                            <Button component={RouterLink} to="/add-book" sx={linkSx}>ADD BOOK</Button>
                        )}
                        <Button component={RouterLink} to="/all-loans" sx={linkSx}>DESK RETURNS</Button>
                    </>
                )}

                {currentRole === "ROLE_ADMIN" && (
                    <Button component={RouterLink} to="/admin" sx={{ ...linkSx, color: "warning.light" }}>
                        ADMIN PANEL
                    </Button>
                )}

                <Box sx={{ flexGrow: 1 }} />

                {!currentRole ? (
                    <>
                        <Button component={RouterLink} to="/login" sx={linkSx}>LOGIN</Button>
                        <Button component={RouterLink} to="/signup" sx={linkSx}>REGISTER</Button>
                    </>
                ) : (
                    <Button onClick={handleLogoutClick} sx={linkSx}>LOGOUT</Button>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
