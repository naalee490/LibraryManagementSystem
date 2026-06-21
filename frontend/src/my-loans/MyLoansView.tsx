import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useApi } from "../api/ApiProvider";
import { Loan } from "../types";
import GenericList from "../components/list/GenericList";
import MyLoanListItem from "./MyLoanListItem";

// reader sees only their own borrowed books
export default function MyLoansView() {
    const api = useApi();
    const [loans, setLoans] = useState<Loan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // load my loans once when page opens
        api.getMyLoans().then(res => {
            if (res.success) setLoans(res.data);
            setLoading(false);
        });
    }, [api]);

    return (
        <Box>
            <Typography variant="h4" gutterBottom>My Loans</Typography>

            {loading && (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {!loading && loans.length === 0 && (
                <Typography color="text.secondary">No loans yet.</Typography>
            )}

            {!loading && loans.length > 0 && (
                <GenericList
                    items={loans}
                    keyExtractor={(loan) => loan.loanID}
                    renderItem={(loan) => <MyLoanListItem loan={loan} />}
                />
            )}
        </Box>
    );
}
