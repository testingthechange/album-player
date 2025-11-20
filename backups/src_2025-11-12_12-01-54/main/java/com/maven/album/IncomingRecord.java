package com.maven.album;

import java.util.List;

public class IncomingRecord {
    private String id;
    private String artist;
    private String track;
    private String timestamp;
    private String source;
    private String status;
    private String album;
    private String label;
    private String notes;
    private List<String> tags;

    public IncomingRecord(String id, String artist, String track, String timestamp,
                          String source, String status, String album, String label,
                          String notes, List<String> tags) {
        this.id = id;
        this.artist = artist;
        this.track = track;
        this.timestamp = timestamp;
        this.source = source;
        this.status = status;
        this.album = album;
        this.label = label;
        this.notes = notes;
        this.tags = tags;
    }

    public String getId() { return id; }
    public String getArtist() { return artist; }
    public String getTrack() { return track; }
    public String getTimestamp() { return timestamp; }
    public String getSource() { return source; }
    public String getStatus() { return status; }
    public String getAlbum() { return album; }
    public String getLabel() { return label; }
    public String getNotes() { return notes; }
    public List<String> getTags() { return tags; }
}
