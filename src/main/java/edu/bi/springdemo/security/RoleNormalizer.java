package edu.bi.springdemo.security;

public final class RoleNormalizer {

    private RoleNormalizer() {
    }

    public static String normalize(String role) {
        if (role == null || role.isBlank()) {
            return "ROLE_READER";
        }
        String trimmed = role.trim().toUpperCase();
        if (trimmed.startsWith("ROLE_")) {
            return trimmed;
        }
        return "ROLE_" + trimmed;
    }
}
