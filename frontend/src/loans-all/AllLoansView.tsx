import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useApi } from "../api/ApiProvider";
import { useAuth } from "../auth/AuthContext";
import { Loan } from "../types";
import GenericList from "../components/list/GenericList";
import DeskLoanListItem from "./DeskLoanListItem";

// desk page for librarian/admin - see all loans + mark returned
export default function AllLoansView() {
    const api = useApi();
    const { isStaff } = useAuth();
    const [loans, setLoans] = useState<Loan[]>([]);
    const [search, setSearch] = useState("");
    const canReturn = isStaff;

    // GET /loan/getAll once on page load
    const load = () => {
        api.getAllLoans().then(res => {
            if (res.success) setLoans(res.data);
        });
    };

    useEffect(() => {
        load(); // fetch all loans when page mounts
    }, [api]);

    // filter in browser so we dont hit API on every keystroke
    const filteredLoans = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return loans;
        return loans.filter(loan =>
            loan.user?.username?.toLowerCase().includes(q) ||
            loan.book?.title?.toLowerCase().includes(q) ||
            loan.book?.author?.toLowerCase().includes(q) ||
            loan.status?.toLowerCase().includes(q) ||
            loan.borrowDate?.includes(q) ||
            loan.dueDate?.includes(q)
        );
    }, [loans, search]);

    // PUT /loan/return - physical return at desk
    const handleReturn = async (loanId: number) => {
        if (!window.confirm("Mark this book as returned at the desk?")) return;
        const response = await api.returnBook(loanId);
        if (response.success) {
            alert("Book returned to the library.");
            load();
        } else {
            alert("Return failed.");
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Desk — returns &amp; loans
            </Typography>

            <Box component="form" onSubmit={(e) => e.preventDefault()} sx={{ mb: 2 }}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                    <TextField
                        label="Search"
                        placeholder="Member, book, status, or date..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        fullWidth
                        size="small"
                    />
                    <Button type="button" variant="text" onClick={() => setSearch("")}>
                        Clear
                    </Button>
                </Stack>
            </Box>

            {filteredLoans.length === 0 ? (
                <Typography color="text.secondary" align="center">
                    {search.trim() ? "No loans match your search." : "No loans in the system."}
                </Typography>
            ) : (
                <GenericList
                    maxWidth={900}
                    items={filteredLoans}
                    keyExtractor={(loan) => loan.loanID}
                    renderItem={(loan) => (
                        <DeskLoanListItem
                            loan={loan}
                            canReturn={canReturn}
                            onReturn={handleReturn}
                        />
                    )}
                />
            )}
        </Box>
    );
}
