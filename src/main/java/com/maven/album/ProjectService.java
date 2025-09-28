package com.maven.album;

import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {
    private final List<Project> projects = new ArrayList<>();
    private long counter = 1;

    public ProjectService() {
        createProject(1L, "Demo Project 1", "2025-09-01");
        createProject(1L, "Demo Project 2", "2025-09-15");
    }

    public List<Project> getAll() {
        return projects;
    }

    public List<Project> getByProducerId(Long producerId) {
        return projects.stream()
                .filter(p -> p.getProducerId() == producerId)
                .collect(Collectors.toList());
    }

    public void createProject(Long producerId, String name, String startDate) {
        Project project = new Project(counter++, name, startDate, producerId, "magic-" + counter);
        projects.add(project);
    }
}
