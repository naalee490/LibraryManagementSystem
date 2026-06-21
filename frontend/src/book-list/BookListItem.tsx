import React from "react";
import {
    Avatar, Box, Button, Divider, ListItem, ListItemAvatar, ListItemText,
    TextField, Typography
} from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { Book } from "../types";

export interface BookListItemProps {
    book: Book;
    canBorrow?: boolean;
    onBorrow?: (book: Book) => void;
    canEditBook?: boolean;
    onEdit?: (book: Book) => void;
    isAdmin?: boolean;
    stockValue?: string;
    onStockChange?: (bookId: number, value: string) => void;
    onStockSave?: (book: Book) => void;
    onDelete?: (book: Book) => void;
}

// One row in the catalogue - shows book info + borrow/admin buttons
export default function BookListItem({
    book,
    canBorrow,
    onBorrow,
    canEditBook,
    onEdit,
    isAdmin,
    stockValue,
    onStockChange,
    onStockSave,
    onDelete,
}: BookListItemProps) {
    return (
        <>
            <ListItem alignItems="flex-start" sx={{ padding: 2, flexDirection: "column", alignItems: "stretch" }}>
                <Box sx={{ display: "flex", width: "100%" }}>
                    <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "primary.main" }}>
                            <MenuBookIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={
                            <Typography variant="h6" color="text.primary">
                                {book.title}
                            </Typography>
                        }
                        secondary={
                            <React.Fragment>
                                <Typography sx={{ display: "inline" }} component="span" variant="body2" color="text.primary">
                                    {book.author}
                                </Typography>
                                {` — Published by ${book.publisher} in ${book.year}.`}
                                <br />
                                <Typography component="span" variant="caption" color="text.secondary">
                                    ISBN: {book.isbn} | Copies Available: <strong>{book.availableCopies}</strong>
                                </Typography>
                            </React.Fragment>
                        }
                    />
                </Box>
                {(canBorrow || canEditBook || isAdmin) && (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1, ml: 7 }}>
                        {canBorrow && onBorrow && (
                            <Button
                                size="small"
                                variant="contained"
                                disabled={book.availableCopies <= 0}
                                onClick={() => onBorrow(book)}
                            >
                                Borrow
                            </Button>
                        )}
                        {canEditBook && onEdit && (
                            <Button size="small" variant="outlined" onClick={() => onEdit(book)}>
                                Edit
                            </Button>
                        )}
                        {isAdmin && onStockChange && onStockSave && onDelete && (
                            <>
                                <TextField
                                    size="small"
                                    type="number"
                                    label="Stock"
                                    value={stockValue ?? String(book.availableCopies)}
                                    onChange={(e) => onStockChange(book.bookID, e.target.value)}
                                    sx={{ width: 100 }}
                                    slotProps={{ htmlInput: { min: 0 } }}
                                />
                                <Button size="small" variant="outlined" onClick={() => onStockSave(book)}>
                                    Save
                                </Button>
                                <Button size="small" variant="outlined" color="error" onClick={() => onDelete(book)}>
                                    Delete
                                </Button>
                            </>
                        )}
                    </Box>
                )}
            </ListItem>
            <Divider variant="inset" component="li" />
        </>
    );
}
