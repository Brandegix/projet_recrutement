package com.oumaima.entities;

public enum Role {
    RECRUITER("RECRUITER"),  // This corresponds to the string value in the database
    CANDIDATE("CANDIDATE");  // This corresponds to the string value in the database

    private String roleName;

    Role(String roleName) {
        this.roleName = roleName;
    }

    public String getRoleName() {
        return roleName;
    }

    public static Role fromString(String roleName) {
        for (Role role : Role.values()) {
            if (role.getRoleName().equalsIgnoreCase(roleName)) {
                return role;
            }
        }
        throw new IllegalArgumentException("Unexpected value: " + roleName);
    }
}
