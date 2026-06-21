import React, { useEffect, useState } from "react";
import {
    Alert, Box, CircularProgress, Typography
} from "@mui/material";
import { useApi } from "../api/ApiProvider";
import { User } from "../library-client/library-client";
import GenericList from "../components/list/GenericList";
import PendingUserListItem from "./PendingUserListItem";

// admin approves librarians who signed up
export default function AdminPanel() {
    const api = useApi();
    const [pendingUsers, setPendingUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    // GET /user/pending - inactive librarian accounts
    const fetchPending = async () => {
        setLoading(true);
        const pending = await api.getPendingUsers();
        if (pending.success) setPendingUsers(pending.data);
        setLoading(false);
    };

    useEffect(() => {
        fetchPending(); // load pending list on open
    }, [api]);

    // sets active=true on backend
    const handleApprove = async (id: number) => {
        const response = await api.approveUser(id);
        if (response.success) {
            alert("Librarian approved.");
            fetchPending();
        } else {
            alert("Approval failed.");
        }
    };

    return (
        <Box>
            <Typography variant="h4" align="center" color="primary" gutterBottom>
                Admin Panel
            </Typography>

            <Typography variant="h6" gutterBottom>
                Pending librarians (approve to activate)
            </Typography>

            {loading && (
                <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                    <CircularProgress size={32} />
                </Box>
            )}

            {!loading && pendingUsers.length === 0 && (
                <Alert severity="success">No pending accounts.</Alert>
            )}

            {!loading && pendingUsers.length > 0 && (
                <GenericList
                    items={pendingUsers}
                    keyExtractor={(u) => u.id}
                    renderItem={(user) => (
                        <PendingUserListItem user={user} onApprove={handleApprove} />
                    )}
                />
            )}
        </Box>
    );
}
