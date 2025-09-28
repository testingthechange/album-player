package com.maven.album;

public class Account {
    private long id;
    private String username;
    private String email;
    private String role;
    private String extraField;

    public Account(long id, String username, String email, String role, String extraField) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.extraField = extraField;
    }

    public long getId() { return id; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public String getExtraField() { return extraField; }
}
