import { Formik, FormikHelpers } from "formik";
import * as yup from "yup";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useApi } from "../api/ApiProvider";

export interface BookFormValues {
    isbn: string;
    title: string;
    author: string;
    publisher: string;
    year: string;
    availableCopies: string;
}

// librarian form for new book in catalog
function AddBookForm() {
    const navigate = useNavigate();
    const apiClient = useApi();

    // librarian sends new book to POST /book/add
    const onSubmit = useCallback(
        async (values: BookFormValues, formikHelpers: FormikHelpers<BookFormValues>) => {
            // form keeps year/copies as strings, API wants numbers
            const formattedData = {
                ...values,
                year: parseInt(values.year, 10),
                availableCopies: parseInt(values.availableCopies, 10)
            };

            const response = await apiClient.addBook(formattedData);

            if (response.success) {
                alert("Book added to catalog successfully!");
                formikHelpers.resetForm();
                navigate("/catalog");
            } else {
                if (response.statusCode === 401 || response.statusCode === 403) {
                    formikHelpers.setFieldError("title", "Not authorized to add books.");
                } else {
                    formikHelpers.setFieldError("title", "Failed to save book. Please try again.");
                }
            }

            formikHelpers.setSubmitting(false);
        }, [apiClient, navigate]
    );

    // ISBN 10/13 digits, year cant be in future etc.
    const validationSchema = useMemo(() =>
        yup.object({
            isbn: yup
                .string()
                .min(10, "ISBN must be at least 10 characters")
                .matches(/^(?:\d{10}|\d{13})$/, "ISBN must be 10 or 13 digits")
                .required("ISBN is required"),
            title: yup.string().required("Title is required"),
            author: yup.string().required("Author is required"),
            publisher: yup.string().required("Publisher is required"),
            year: yup
                .number()
                .min(1000)
                .max(new Date().getFullYear(), "Year cannot be in the future")
                .required("Year is required"),
            availableCopies: yup
                .number()
                .min(0, "Copies cannot be negative")
                .required("Copies are required"),
        }), []
    );

    return (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 520 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Add New Book
                </Typography>
                <Formik<BookFormValues>
                    initialValues={{
                        isbn: "", title: "", author: "",
                        publisher: "", year: "", availableCopies: ""
                    }}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {formik => (
                        <Box component="form" onSubmit={formik.handleSubmit} noValidate>
                            <TextField
                                id="isbn"
                                name="isbn"
                                label="ISBN"
                                variant="standard"
                                fullWidth
                                margin="normal"
                                value={formik.values.isbn}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.isbn && Boolean(formik.errors.isbn)}
                                helperText={formik.touched.isbn && formik.errors.isbn}
                            />
                            <TextField
                                id="title"
                                name="title"
                                label="Book Title"
                                variant="standard"
                                fullWidth
                                margin="normal"
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.title && Boolean(formik.errors.title)}
                                helperText={formik.touched.title && formik.errors.title}
                            />
                            <TextField
                                id="author"
                                name="author"
                                label="Author"
                                variant="standard"
                                fullWidth
                                margin="normal"
                                value={formik.values.author}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.author && Boolean(formik.errors.author)}
                                helperText={formik.touched.author && formik.errors.author}
                            />
                            <TextField
                                id="publisher"
                                name="publisher"
                                label="Publisher"
                                variant="standard"
                                fullWidth
                                margin="normal"
                                value={formik.values.publisher}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.publisher && Boolean(formik.errors.publisher)}
                                helperText={formik.touched.publisher && formik.errors.publisher}
                            />
                            <Box sx={{ display: "flex", gap: 2 }}>
                                <TextField
                                    id="year"
                                    name="year"
                                    label="Year"
                                    type="number"
                                    variant="standard"
                                    fullWidth
                                    margin="normal"
                                    value={formik.values.year}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.year && Boolean(formik.errors.year)}
                                    helperText={formik.touched.year && formik.errors.year}
                                />
                                <TextField
                                    id="availableCopies"
                                    name="availableCopies"
                                    label="Copies"
                                    type="number"
                                    variant="standard"
                                    fullWidth
                                    margin="normal"
                                    value={formik.values.availableCopies}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.availableCopies && Boolean(formik.errors.availableCopies)}
                                    helperText={formik.touched.availableCopies && formik.errors.availableCopies}
                                />
                            </Box>
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{ mt: 3 }}
                                disabled={formik.isSubmitting}
                            >
                                {formik.isSubmitting ? "Saving..." : "Add to Catalog"}
                            </Button>
                        </Box>
                    )}
                </Formik>
            </Paper>
        </Box>
    );
}

export default AddBookForm;
