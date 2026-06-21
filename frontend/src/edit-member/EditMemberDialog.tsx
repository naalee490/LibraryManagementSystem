import { Formik, FormikHelpers } from "formik";
import * as yup from "yup";
import { useMemo } from "react";
import {
    Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography
} from "@mui/material";
import { User } from "../library-client/library-client";

export interface MemberEditValues {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
}

interface EditMemberDialogProps {
    user: User | null;
    open: boolean;
    onClose: () => void;
    onSave: (userId: number, values: MemberEditValues) => Promise<boolean>;
}

// admin fixes library contact info - login identity stays private
export default function EditMemberDialog({ user, open, onClose, onSave }: EditMemberDialogProps) {
    const validationSchema = useMemo(() =>
        yup.object({
            firstName: yup.string().required("First name is required"),
            lastName: yup.string().required("Last name is required"),
            email: yup.string().email("Enter a valid email").required("Email is required"),
            phoneNumber: yup
                .string()
                .matches(/^\d{9}$/, "Must be exactly 9 digits")
                .required("Phone is required"),
        }), []
    );

    if (!user) return null;

    const initialValues: MemberEditValues = {
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        email: user.email,
        phoneNumber: user.phoneNumber ?? "",
    };

    const handleSubmit = async (
        values: MemberEditValues,
        helpers: FormikHelpers<MemberEditValues>
    ) => {
        const ok = await onSave(user.id, values);
        helpers.setSubmitting(false);
        if (ok) onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Edit contact info</DialogTitle>
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
                                Username <strong>{user.username}</strong> and password are not editable here
                                (use reset password if needed).
                            </Typography>
                            <TextField
                                name="firstName"
                                label="First name"
                                fullWidth
                                margin="normal"
                                value={formik.values.firstName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                helperText={formik.touched.firstName && formik.errors.firstName}
                            />
                            <TextField
                                name="lastName"
                                label="Last name"
                                fullWidth
                                margin="normal"
                                value={formik.values.lastName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                helperText={formik.touched.lastName && formik.errors.lastName}
                            />
                            <TextField
                                name="email"
                                label="Email"
                                fullWidth
                                margin="normal"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            />
                            <TextField
                                name="phoneNumber"
                                label="Phone"
                                fullWidth
                                margin="normal"
                                value={formik.values.phoneNumber}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                                helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
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
