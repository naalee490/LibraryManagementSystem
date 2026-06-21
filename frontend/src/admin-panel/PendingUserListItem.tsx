import React from "react";
import {
    Avatar, Box, Button, Divider, ListItem, ListItemAvatar, ListItemText, Typography
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { User } from "../library-client/library-client";

export interface PendingUserListItemProps {
    user: User;
    onApprove: (id: number) => void;
}

// one pending librarian waiting for approve
export default function PendingUserListItem({ user, onApprove }: PendingUserListItemProps) {
    return (
        <>
            <ListItem alignItems="flex-start" sx={{ padding: 2, flexDirection: "column", alignItems: "stretch" }}>
                <Box sx={{ display: "flex", width: "100%" }}>
                    <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "primary.main" }}>
                            <PersonAddIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={
                            <Typography variant="h6" component="span">
                                {user.username}
                            </Typography>
                        }
                        secondary={
                            <Typography component="span" variant="body2" color="text.secondary">
                                {user.email} · ID {user.id}
                            </Typography>
                        }
                    />
                </Box>
                <Box sx={{ mt: 1, ml: 7 }}>
                    <Button size="small" variant="contained" color="success" onClick={() => onApprove(user.id)}>
                        Approve
                    </Button>
                </Box>
            </ListItem>
            <Divider variant="inset" component="li" />
        </>
    );
}
