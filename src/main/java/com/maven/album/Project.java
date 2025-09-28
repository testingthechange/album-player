package com.maven.album;

public class Project {
    private long id;
    private String name;
    private String startDate;
    private long producerId;
    private String magicLink;

    public Project(long id, String name, String startDate, long producerId, String magicLink) {
        this.id = id;
        this.name = name;
        this.startDate = startDate;
        this.producerId = producerId;
        this.magicLink = magicLink;
    }

    public long getId() { return id; }
    public String getName() { return name; }
    public String getStartDate() { return startDate; }
    public long getProducerId() { return producerId; }
    public String getMagicLink() { return magicLink; }
}
