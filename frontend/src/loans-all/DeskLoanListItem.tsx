import React from "react";
import {
    Avatar, Box, Button, Chip, Divider, ListItem, ListItemAvatar, ListItemText, Typography
} from "@mui/material";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import { Loan } from "../types";
import { displayDueDate, formatLoanDate } from "../utils/loanDates";

export interface DeskLoanListItemProps {
    loan: Loan;
    canReturn: boolean;
    onReturn: (loanId: number) => void;
}

// chip colour for loan status
function statusColor(status?: string): "success" | "default" | "warning" {
    if (status === "RETURNED") return "success";
    if (status === "BORROWED") return "warning";
    return "default";
}

// single loan row on desk returns page
export default function DeskLoanListItem({ loan, canReturn, onReturn }: DeskLoanListItemProps) {
    return (
        <>
            <ListItem alignItems="flex-start" sx={{ padding: 2, flexDirection: "column", alignItems: "stretch" }}>
                <Box sx={{ display: "flex", width: "100%" }}>
                    <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "primary.main" }}>
                            <AssignmentReturnIcon />
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
                                    Member: {loan.user?.username ?? "—"}
                                    {loan.book?.author ? ` · ${loan.book.author}` : ""}
                                </Typography>
                                <Typography component="span" variant="body2" color="text.secondary" sx={{ display: "block" }}>
                                    Borrowed: {formatLoanDate(loan.borrowDate)} · Due: {displayDueDate(loan.borrowDate, loan.dueDate)}
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
                </Box>
                {canReturn && loan.status === "BORROWED" && (
                    <Box sx={{ mt: 1, ml: 7 }}>
                        <Button
                            size="small"
                            variant="contained"
                            color="success"
                            onClick={() => onReturn(loan.loanID)}
                        >
                            Return book
                        </Button>
                    </Box>
                )}
            </ListItem>
            <Divider variant="inset" component="li" />
        </>
    );
}
