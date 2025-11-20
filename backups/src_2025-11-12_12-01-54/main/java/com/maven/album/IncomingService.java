package com.maven.album;

import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class IncomingService {
    private final List<IncomingRecord> records = new ArrayList<>();

    public IncomingService() {
        // Seed demo records with correct 10-arg constructor
        records.add(new IncomingRecord(
            "1", "Email", "Message", "Welcome to the system!",
            "-", "-", "-", "-", "-", new ArrayList<>()
        ));
        records.add(new IncomingRecord(
            "2", "Upload", "File", "demo-track.mp3",
            "-", "-", "-", "-", "-", new ArrayList<>()
        ));
        records.add(new IncomingRecord(
            "3", "API", "Webhook", "Project update received",
            "-", "-", "-", "-", "-", new ArrayList<>()
        ));
    }

    public List<IncomingRecord> getAllIncoming() {
        return records;
    }

    public void addTestRecord(String id, String source, String type, String content) {
        records.add(new IncomingRecord(
            id, source, type, content,
            "-", "-", "-", "-", "-", new ArrayList<>()
        ));
    }
}
