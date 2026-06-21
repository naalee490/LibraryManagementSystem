import { Formik, FormikHelpers } from "formik";
import * as yup from "yup";
import { useMemo } from "react";
import {
    Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography
} from "@mui/material";
import { Book } from "../types";

export interface BookEditValues {
    title: string;
    author: string;
    publisher: string;
    year: string;
}

interface EditBookDialogProps {
    book: Book | null;
    open: boolean;
    onClose: () => void;
    onSave: (book: Book, values: BookEditValues) => Promise<boolean>;
}

// edit title/author etc - ISBN stays fixed (catalog id)
export default function EditBookDialog({ book, open, onClose, onSave }: EditBookDialogProps) {
    const validationSchema = useMemo(() =>
        yup.object({
            title: yup.string().required("Title is required"),
            author: yup.string().required("Author is required"),
            publisher: yup.string().required("Publisher is required"),
            year: yup
                .number()
                .min(1000)
                .max(new Date().getFullYear(), "Year cannot be in the future")
                .required("Year is required"),
        }), []
    );

    if (!book) return null;

    const initialValues: BookEditValues = {
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        year: String(book.year),
    };

    const handleSubmit = async (
        values: BookEditValues,
        helpers: FormikHelpers<BookEditValues>
    ) => {
        const ok = await onSave(book, values);
        helpers.setSubmitting(false);
        if (ok) onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Edit book</DialogTitle>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {formik => (
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <DialogContent>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                ISBN: {book.isbn} (cannot be changed)
                            </Typography>
                            <TextField
                                name="title"
                                label="Title"
                                fullWidth
                                margin="normal"
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.title && Boolean(formik.errors.title)}
                                helperText={formik.touched.title && formik.errors.title}
                            />
                            <TextField
                                name="author"
                                label="Author"
                                fullWidth
                                margin="normal"
                                value={formik.values.author}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.author && Boolean(formik.errors.author)}
                                helperText={formik.touched.author && formik.errors.author}
                            />
                            <TextField
                                name="publisher"
                                label="Publisher"
                                fullWidth
                                margin="normal"
                                value={formik.values.publisher}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.publisher && Boolean(formik.errors.publisher)}
                                helperText={formik.touched.publisher && formik.errors.publisher}
                            />
                            <TextField
                                name="year"
                                label="Year"
                                type="number"
                                fullWidth
                                margin="normal"
                                value={formik.values.year}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.year && Boolean(formik.errors.year)}
                                helperText={formik.touched.year && formik.errors.year}
                            />
                        </DialogContent>
                        <DialogActions sx={{ px: 3, pb: 2 }}>
                            <Button onClick={onClose}>Cancel</Button>
                            <Button type="submit" variant="contained" disabled={formik.isSubmitting}>
                                {formik.isSubmitting ? "Saving..." : "Save"}
                            </Button>
                        </DialogActions>
                    </Box>
                )}
            </Formik>
        </Dialog>
    );
}
