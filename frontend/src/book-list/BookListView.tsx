import React, { useEffect, useState } from "react";
import { Alert, Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useApi } from "../api/ApiProvider";
import { useAuth } from "../auth/AuthContext";
import { Book } from "../types";
import GenericList from "../components/list/GenericList";
import BookListItem from "./BookListItem";
import EditBookDialog, { BookEditValues } from "../edit-book/EditBookDialog";
import { displayDueDate, formatLoanDate } from "../utils/loanDates";

// Main catalog page - loads books from API and plugs them into GenericList
export default function BookListView() {
    const api = useApi();
    const { userId, isAdmin, canBorrow } = useAuth();
    const [books, setBooks] = useState<Book[]>([]);
    const [search, setSearch] = useState("");
    const [stockEdits, setStockEdits] = useState<Record<number, string>>({});
    const [message, setMessage] = useState<string | null>(null);
    const [bookToEdit, setBookToEdit] = useState<Book | null>(null);

    // GET all books or search if user typed something
    const loadBooks = async (query?: string) => {
        const response = query?.trim()
            ? await api.searchBooks(query.trim())
            : await api.getBooks();
        if (response.success) setBooks(response.data);
    };

    useEffect(() => {
        loadBooks(); // fetch catalogue on first render
    }, [api]);

    // submit search box on catalogue
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadBooks(search);
    };

    // reader clicks Borrow -> creates loan on backend
    const handleBorrow = async (book: Book) => {
        if (!userId) return;
        const response = await api.borrowBook(book.bookID, userId);
        if (response.success) {
            const loan = response.data;
            setMessage(
                `Borrowed "${book.title}" on ${formatLoanDate(loan?.borrowDate)}. ` +
                `Return by ${displayDueDate(loan?.borrowDate, loan?.dueDate)}.`
            );
            loadBooks(search);
        } else {
            alert("Could not borrow. No copies left or server error.");
        }
    };

    // admin changes how many copies are on shelf
    const handleStockSave = async (book: Book) => {
        const raw = stockEdits[book.bookID] ?? String(book.availableCopies);
        const copies = parseInt(raw, 10);
        if (Number.isNaN(copies) || copies < 0) {
            alert("Enter a valid number (0 or more).");
            return;
        }
        const response = await api.updateBookStock(book.bookID, copies);
        if (response.success) {
            setMessage(`Stock updated for "${book.title}".`);
            loadBooks(search);
        } else if (response.statusCode === 403) {
            alert("Access denied. Log out and log in again as admin.");
        } else {
            alert("Could not update stock.");
        }
    };

    // staff saves title/author/publisher/year (ISBN unchanged)
    const handleEditBook = async (book: Book, values: BookEditValues): Promise<boolean> => {
        const response = await api.updateBook(book.bookID, {
            title: values.title,
            author: values.author,
            publisher: values.publisher,
            year: parseInt(values.year, 10),
            availableCopies: book.availableCopies,
        });
        if (response.success) {
            setMessage(`Updated "${values.title}".`);
            loadBooks(search);
            return true;
        }
        if (response.statusCode === 403) {
            alert("Access denied. Log out and log in again as admin.");
        } else {
            alert("Could not update book.");
        }
        return false;
    };

    // admin removes title from db (fails if loans still active)
    const handleDeleteBook = async (book: Book) => {
        if (!window.confirm(`Delete "${book.title}" from the catalog?`)) return;
        const response = await api.deleteBook(book.bookID);
        if (response.success) {
            setMessage(`"${book.title}" removed from the catalog.`);
            loadBooks(search);
        } else {
            alert(response.data ?? "Could not delete. Active loans may still exist for this title.");
        }
    };

    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="h4" gutterBottom>
                {isAdmin ? "Catalogue management" : "Library Catalog"}
            </Typography>

            <Box component="form" onSubmit={handleSearch} sx={{ mb: 2 }}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                    <TextField
                        label="Search"
                        placeholder="Title, author, or ISBN..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        fullWidth
                        size="small"
                    />
                    <Button type="submit" variant="outlined">Search</Button>
                    <Button type="button" variant="text" onClick={() => { setSearch(""); loadBooks(); }}>
                        Clear
                    </Button>
                </Stack>
            </Box>

            {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

            {books.length === 0 ? (
                <Typography color="text.secondary" align="center">No books found.</Typography>
            ) : (
                // List 6 pattern: generic container + custom row component
                <GenericList
                    items={books}
                    keyExtractor={(b) => b.bookID}
                    renderItem={(book) => (
                        <BookListItem
                            book={book}
                            canBorrow={canBorrow}
                            onBorrow={handleBorrow}
                            canEditBook={isAdmin}
                            onEdit={setBookToEdit}
                            isAdmin={isAdmin}
                            stockValue={stockEdits[book.bookID]}
                            onStockChange={(id, value) =>
                                setStockEdits(prev => ({ ...prev, [id]: value }))
                            }
                            onStockSave={handleStockSave}
                            onDelete={handleDeleteBook}
                        />
                    )}
                />
            )}

            <EditBookDialog
                book={bookToEdit}
                open={bookToEdit != null}
                onClose={() => setBookToEdit(null)}
                onSave={handleEditBook}
            />
        </Box>
    );
}
