import React from "react";
import {
    Avatar, Chip, Divider, ListItem, ListItemAvatar, ListItemText, Typography
} from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { Loan } from "../types";
import { displayDueDate, formatLoanDate } from "../utils/loanDates";

function statusColor(status?: string): "success" | "default" | "warning" {
    // green = returned, orange = still out
    if (status === "RETURNED") return "success";
    if (status === "BORROWED") return "warning";
    return "default";
}

// one loan on "my loans" - read only no buttons
export default function MyLoanListItem({ loan }: { loan: Loan }) {
    return (
        <>
            <ListItem alignItems="flex-start" sx={{ padding: 2 }}>
                <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "primary.main" }}>
                        <MenuBookIcon />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={
                        <Typography variant="h6" component="span">
                            {loan.book?.title ?? "Unknown book"}
                        </Typography>
                    }
                    secondary={
                        <>
                            <Typography component="span" variant="body2" color="text.primary" sx={{ display: "block" }}>
                                Borrowed: {formatLoanDate(loan.borrowDate)} · Due: {displayDueDate(loan.borrowDate, loan.dueDate)}
                            </Typography>
                            <Typography component="span" variant="body2" color="text.secondary" sx={{ display: "block" }}>
                                Returned: {loan.returnDate || "—"}
                            </Typography>
                            <Chip
                                size="small"
                                label={loan.status ?? "—"}
                                color={statusColor(loan.status)}
                                sx={{ mt: 0.5 }}
                            />
                        </>
                    }
                />
            </ListItem>
            <Divider variant="inset" component="li" />
        </>
    );
}
