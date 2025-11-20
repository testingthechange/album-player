package com.maven.album;

public class Producer {
    private long id;
    private String name;
    private String email;

    public Producer(long id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    public long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
}
