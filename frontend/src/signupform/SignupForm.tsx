import React, { useCallback, useMemo } from "react";
import { Formik, FormikHelpers } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import {
    Box, Button, MenuItem, Paper, TextField, Typography, Alert
} from "@mui/material";
import { useApi } from "../api/ApiProvider";
import { SignupDto } from "../dto/signup.dto";

type SignupFormValues = SignupDto & { confirmPassword: string }; // confirm only for UI, not sent to API

// Register new reader/librarian - same Formik + Yup + MUI pattern as login
function SignupForm() {
    const navigate = useNavigate();
    const apiClient = useApi();

    // all signup validation in one place
    const validationSchema = useMemo(() => yup.object().shape({
        firstName: yup.string().required("First name is required"),
        lastName: yup.string().required("Last name is required"),
        username: yup
            .string()
            .min(3, "Username must be at least 3 characters")
            .max(20, "Username cannot exceed 20 characters")
            .required("Username is required!"),
        email: yup
            .string()
            .email("Please enter a valid email address")
            .required("Email is required!"),
        phoneNumber: yup
            .string()
            .matches(/^\d{9}$/, "Must be exactly 9 digits")
            .required("Phone is required"),
        password: yup
            .string()
            .min(8, "Password must be at least 8 characters")
            //require uppercase letter:
            // .matches(/[A-Z]/, "Password must include at least one uppercase letter")
            //require number:
            // .matches(/[0-9]/, "Password must include at least one number")
            .required("Password is required!"),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref("password")], "Passwords must match")
            .required("Please confirm your password!"),
        role: yup.string().required(),
    }), []);

    // send signup to POST /user/add
    const onSubmit = useCallback(async (
        values: SignupFormValues,
        formikHelpers: FormikHelpers<SignupFormValues>
    ) => {
        // backend doesnt need confirmPassword so we drop it here
        const { confirmPassword: _, ...payload } = values;
        const response = await apiClient.signup(payload);

        if (response.success) {
            if (payload.role === "LIBRARIAN") {
                alert(
                    "Librarian account created.\n\n" +
                    "An admin must approve it before you can log in. " +
                    "You will be able to sign in once your account is active."
                );
            } else {
                alert("Account created successfully! You can log in now.");
            }
            navigate("/login");
        } else {
            if (response.statusCode === 0) {
                formikHelpers.setFieldError("username", "Cannot reach the server.");
            } else if (response.statusCode === 409) {
                formikHelpers.setFieldError("username", "Username already taken");
            } else if (response.statusCode === 400 && response.data) {
                formikHelpers.setFieldError("password", response.data);
            } else {
                formikHelpers.setFieldError("username", "Registration failed.");
            }
        }

        formikHelpers.setSubmitting(false);
    }, [apiClient, navigate]);

    return (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 560 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Create Account
                </Typography>
                <Formik<SignupFormValues>
                    initialValues={{
                        username: "", password: "", confirmPassword: "",
                        firstName: "", lastName: "", email: "", phoneNumber: "", role: "READER"
                    }}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {formik => (
                        <Box component="form" onSubmit={formik.handleSubmit} noValidate>
                            <Box sx={{ display: "flex", gap: 2 }}>
                                <TextField
                                    id="firstName"
                                    name="firstName"
                                    label="First Name"
                                    variant="standard"
                                    fullWidth
                                    margin="normal"
                                    value={formik.values.firstName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                    helperText={formik.touched.firstName && formik.errors.firstName}
                                />
                                <TextField
                                    id="lastName"
                                    name="lastName"
                                    label="Last Name"
                                    variant="standard"
                                    fullWidth
                                    margin="normal"
                                    value={formik.values.lastName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                    helperText={formik.touched.lastName && formik.errors.lastName}
                                />
                            </Box>
                            <TextField
                                id="email"
                                name="email"
                                label="Email"
                                variant="standard"
                                fullWidth
                                margin="normal"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            />
                            <TextField
                                id="phoneNumber"
                                name="phoneNumber"
                                label="Phone (9 digits)"
                                variant="standard"
                                fullWidth
                                margin="normal"
                                value={formik.values.phoneNumber}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                                helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                            />
                            <TextField
                                id="username"
                                name="username"
                                label="Username"
                                variant="standard"
                                fullWidth
                                margin="normal"
                                value={formik.values.username}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.username && Boolean(formik.errors.username)}
                                helperText={formik.touched.username && formik.errors.username}
                            />
                            <TextField
                                id="password"
                                name="password"
                                label="Password"
                                type="password"
                                variant="standard"
                                fullWidth
                                margin="normal"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={
                                    formik.touched.password && formik.errors.password
                                        ? formik.errors.password
                                        : "At least 8 characters"
                                }
                            />
                            <TextField
                                id="confirmPassword"
                                name="confirmPassword"
                                label="Confirm Password"
                                type="password"
                                variant="standard"
                                fullWidth
                                margin="normal"
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                            />
                            <TextField
                                id="role"
                                name="role"
                                label="Account type"
                                select
                                variant="standard"
                                fullWidth
                                margin="normal"
                                value={formik.values.role}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                helperText={
                                    formik.values.role === "LIBRARIAN"
                                        ? "Librarian accounts need admin approval before you can log in."
                                        : "Reader accounts are active immediately after registration."
                                }
                            >
                                <MenuItem value="READER">Reader</MenuItem>
                                <MenuItem value="LIBRARIAN">Librarian</MenuItem>
                            </TextField>
                            {formik.values.role === "LIBRARIAN" && (
                                <Alert severity="info" sx={{ mt: 2 }}>
                                    After registering, an administrator will verify your account.
                                    You cannot log in until it is approved.
                                </Alert>
                            )}
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{ mt: 3 }}
                                disabled={formik.isSubmitting}
                            >
                                {formik.isSubmitting ? "Registering..." : "Register"}
                            </Button>
                        </Box>
                    )}
                </Formik>
            </Paper>
        </Box>
    );
}

export default SignupForm;
