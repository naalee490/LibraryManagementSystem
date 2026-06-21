import React, { useCallback, useMemo } from "react";
import { Formik, FormikHelpers } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useApi } from "../api/ApiProvider";
import { LoginDto } from "../dto/login.dto";

interface LoginFormProps {
    setRole: (role: string | null) => void; // parent App keeps role for navbar + routes
}

// Login page - Formik holds values, Yup checks fields before submit
function LoginForm({ setRole }: LoginFormProps) {
    const navigate = useNavigate();
    const apiClient = useApi();

    // simple rules - both fields required
    const validationSchema = useMemo(() => yup.object().shape({
        username: yup.string().required("Username is required!"),
        password: yup.string().required("Password is required!"),
    }), []);

    // called when user clicks LOGIN (after Yup passes)
    const onSubmit = useCallback(async (
        values: LoginDto,
        formikHelpers: FormikHelpers<LoginDto>
    ) => {
        const response = await apiClient.login(values);

        if (response.success && response.data?.token && response.data?.role) {
            setRole(response.data.role); // unlocks routes like my-loans
            navigate("/catalog");
        } else {
            if (response.statusCode === 0) {
                formikHelpers.setFieldError("username", "Cannot reach the server.");
            } else if (response.statusCode === 401 || response.statusCode === 403) {
                formikHelpers.setFieldError("username", "Invalid username or password.");
            } else {
                formikHelpers.setFieldError("username", "Login failed.");
            }
        }

        formikHelpers.setSubmitting(false);
    }, [apiClient, navigate, setRole]);

    return (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 420 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Login
                </Typography>
                <Formik<LoginDto>
                    initialValues={{ username: "", password: "" }}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {formik => (
                        <Box component="form" onSubmit={formik.handleSubmit} noValidate>
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
                                helperText={formik.touched.password && formik.errors.password}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{ mt: 3 }}
                                disabled={formik.isSubmitting}
                            >
                                {formik.isSubmitting ? "Logging in..." : "LOGIN"}
                            </Button>
                        </Box>
                    )}
                </Formik>
            </Paper>
        </Box>
    );
}

export default LoginForm;
