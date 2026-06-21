import React, { ReactNode } from "react";
import { List, Paper } from "@mui/material";

interface GenericListProps<T> {
    items: T[];
    renderItem: (item: T) => ReactNode;
    keyExtractor: (item: T) => string | number;
    maxWidth?: number | string;
}

/**
 * Reusable list shell - works for books, users, loans.
 * U pass items + a function that draws one row (renderItem).
 */
function GenericList<T>({ items, renderItem, keyExtractor, maxWidth = 800 }: GenericListProps<T>) {
    return (
        <Paper elevation={3} sx={{ margin: "2rem auto", maxWidth, bgcolor: "background.paper" }}>
            <List sx={{ width: "100%" }}>
                {items.map((item) => (
                    <React.Fragment key={keyExtractor(item)}>
                        {renderItem(item)}
                    </React.Fragment>
                ))}
            </List>
        </Paper>
    );
}

export default GenericList;