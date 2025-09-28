package com.maven.album;

import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Arrays;

@Service
public class IncomingService {
    private final List<IncomingRecord> incoming = new ArrayList<>();
    private long counter = 1;

    public IncomingService() {
        addTestRecord("Test Artist 1", "Track A");
        addTestRecord("Test Artist 2", "Track B");
    }

    public List<IncomingRecord> getAllIncoming() {
        return incoming;
    }

    public void addTestRecord(String artist, String track) {
        incoming.add(new IncomingRecord(
                "IN-" + counter++, artist, track,
                "2025-09-01T00:00:00Z",
                "SEED",
                "NEW",
                "DemoAlbum",
                "DemoLabel",
                "Seeded row for UI",
                Arrays.asList("seed","demo")
        ));
    }
}
