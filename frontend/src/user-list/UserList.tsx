import React, { useEffect, useState } from "react";
import { Alert, Box, Button, CircularProgress, Stack, TextField, Typography } from "@mui/material";
import { useApi } from "../api/ApiProvider";
import { useAuth } from "../auth/AuthContext";
import { User } from "../library-client/library-client";
import GenericList from "../components/list/GenericList";
import UserListItem from "./UserListItem";
import EditMemberDialog, { MemberEditValues } from "../edit-member/EditMemberDialog";

// members page - reuses GenericList like catalogue does
export default function UserList() {
    const api = useApi();
    const { isAdmin } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userToEdit, setUserToEdit] = useState<User | null>(null);

    // staff/admin list from GET /user/getAll or /user/search
    const loadUsers = async (query?: string) => {
        setLoading(true);
        const response = query?.trim()
            ? await api.searchUsers(query.trim())
            : await api.getUsers();

        if (response.success) {
            setUsers(response.data);
            setError(null);
        } else if (response.statusCode === 401 || response.statusCode === 403) {
            setError("You do not have permission to view the user list.");
        } else {
            setError("Could not load users. Is the server running?");
        }
        setLoading(false);
    };

    useEffect(() => {
        loadUsers(); // initial members list
    }, [api]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadUsers(search); // run search with whats in the textbox
    };

    // admin delete - warn if they still have books out
    const handleDelete = async (id: number) => {
        const user = users.find((u) => u.id === id);
        const name = user?.username ?? "this user";
        const confirmed = window.confirm(
            `Delete account "${name}" permanently?\n\n` +
            "All loan history will be removed. If they still have borrowed books, " +
            "those copies will be returned to the catalogue."
        );
        if (!confirmed) return;
        const response = await api.deleteUser(id);
        if (response.success) loadUsers(search);
        else alert(response.data ?? "Could not delete user.");
    };

    // admin only - asks confirm first
    const handleResetPassword = async (id: number) => {
        const user = users.find((u) => u.id === id);
        const name = user?.username ?? "this user";
        if (!window.confirm(`Reset password for "${name}"? A new temporary password will be generated.`)) {
            return;
        }
        const response = await api.resetPassword(id);
        if (response.success) alert(response.data);
        else alert("Reset failed.");
    };

    // reader vs librarian buttons
    const handleChangeRole = async (id: number, newRole: string) => {
        const response = await api.changeRole(id, newRole);
        if (response.success) {
            alert(response.data);
            loadUsers(search);
        } else {
            alert("Could not change role.");
        }
    };

    // admin edits name/email/phone only
    const handleUpdateMember = async (id: number, values: MemberEditValues): Promise<boolean> => {
        const response = await api.updateMemberProfile(id, values);
        if (response.success) {
            loadUsers(search);
            return true;
        }
        if (response.statusCode === 409) {
            alert("That email is already used by another account.");
        } else {
            alert("Could not update member.");
        }
        return false;
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                {isAdmin ? "Member management" : "Library members"}
            </Typography>

            <Box component="form" onSubmit={handleSearch} sx={{ mb: 2 }}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                    <TextField
                        label="Search"
                        placeholder="Username or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        fullWidth
                        size="small"
                    />
                    <Button type="submit" variant="outlined">Search</Button>
                    {isAdmin && (
                        <Button
                            type="button"
                            variant="text"
                            onClick={() => {
                                setSearch("");
                                loadUsers();
                            }}
                        >
                            Show all
                        </Button>
                    )}
                </Stack>
            </Box>

            {loading && (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <CircularProgress />
                </Box>
            )}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {!loading && !error && users.length === 0 && (
                <Typography color="text.secondary" align="center">No users found.</Typography>
            )}

            {!loading && !error && users.length > 0 && (
                <GenericList
                    maxWidth={960}
                    items={users}
                    keyExtractor={(u) => u.id}
                    renderItem={(user) => (
                        <UserListItem
                            user={user}
                            isAdmin={isAdmin}
                            onEdit={setUserToEdit}
                            onResetPassword={handleResetPassword}
                            onChangeRole={handleChangeRole}
                            onDelete={handleDelete}
                        />
                    )}
                />
            )}

            <EditMemberDialog
                user={userToEdit}
                open={userToEdit != null}
                onClose={() => setUserToEdit(null)}
                onSave={handleUpdateMember}
            />
        </Box>
    );
}
