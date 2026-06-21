import React from "react";
import {
    Avatar, Box, Button, Chip, Divider, ListItem, ListItemAvatar, ListItemText, Typography
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { User } from "../library-client/library-client";

export interface UserListItemProps {
    user: User;
    isAdmin: boolean;
    onEdit?: (user: User) => void;
    onResetPassword: (id: number) => void;
    onChangeRole: (id: number, role: string) => void;
    onDelete: (id: number) => void;
}

// one member row - admin gets extra buttons at bottom
export default function UserListItem({
    user,
    isAdmin,
    onEdit,
    onResetPassword,
    onChangeRole,
    onDelete,
}: UserListItemProps) {
    const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || "—";

    return (
        <>
            <ListItem alignItems="flex-start" sx={{ padding: 2, flexDirection: "column", alignItems: "stretch" }}>
                <Box sx={{ display: "flex", width: "100%" }}>
                    <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "primary.main" }}>
                            <PersonIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={
                            <Typography variant="h6" component="span">
                                {user.username}
                            </Typography>
                        }
                        secondary={
                            <>
                                <Typography component="span" variant="body2" color="text.primary" sx={{ display: "block" }}>
                                    {user.email}
                                </Typography>
                                <Typography component="span" variant="body2" color="text.secondary" sx={{ display: "block" }}>
                                    {fullName} · ID {user.id}
                                </Typography>
                                <Box sx={{ mt: 0.5, display: "flex", gap: 1, flexWrap: "wrap" }}>
                                    <Chip
                                        size="small"
                                        label={user.active ? "Active" : "Inactive"}
                                        color={user.active ? "success" : "default"}
                                    />
                                    {isAdmin && user.role && (
                                        <Chip size="small" label={user.role} variant="outlined" />
                                    )}
                                </Box>
                            </>
                        }
                    />
                </Box>
                {isAdmin && user.role !== "ROLE_ADMIN" && (
                    <Box sx={{ mt: 1.5, ml: 7, display: "flex", flexDirection: "column", gap: 1.5 }}>
                        <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                                Account
                            </Typography>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                {onEdit && (
                                    <Button size="small" variant="outlined" onClick={() => onEdit(user)}>
                                        Edit contact
                                    </Button>
                                )}
                                <Button size="small" variant="outlined" onClick={() => onResetPassword(user.id)}>
                                    Reset password
                                </Button>
                                <Button size="small" variant="outlined" color="error" onClick={() => onDelete(user.id)}>
                                    Delete
                                </Button>
                            </Box>
                        </Box>
                        <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                                Change role
                            </Typography>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                <Button size="small" variant="outlined" onClick={() => onChangeRole(user.id, "READER")}>
                                    Reader
                                </Button>
                                <Button size="small" variant="outlined" onClick={() => onChangeRole(user.id, "LIBRARIAN")}>
                                    Librarian
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                )}
            </ListItem>
            <Divider variant="inset" component="li" />
        </>
    );
}
