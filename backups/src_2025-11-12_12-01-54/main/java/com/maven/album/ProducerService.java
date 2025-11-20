package com.maven.album;

import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProducerService {
    private final List<Producer> producers = new ArrayList<>();
    private long counter = 1;

    public ProducerService() {
        addProducer("Demo Producer", "producer@example.com");
    }

    public List<Producer> getAll() {
        return producers;
    }

    public void addProducer(String name, String email) {
        Producer producer = new Producer(counter++, name, email);
        producers.add(producer);
    }
}
