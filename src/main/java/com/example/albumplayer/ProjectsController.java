package com.example.albumplayer;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Controller
@RequestMapping("/admin/producers")
public class ProjectsController {

    // In-memory project storage: producerId -> list of projects
    private final Map<Long, List<ProjectEntry>> projectStore = new HashMap<>();

    // GET /admin/producers/{id}/projects -> show form + list
    @GetMapping("/{id}/projects")
    public String showProjects(@PathVariable("id") long producerId, Model model) {
        List<ProjectEntry> projectList = projectStore.getOrDefault(producerId, new ArrayList<>());
        model.addAttribute("producerId", producerId);
        model.addAttribute("projectList", projectList);
        return "admin/projects";
    }

    // POST /admin/producers/{id}/projects -> add a project and reload page
    @PostMapping("/{id}/projects")
    public String createProject(@PathVariable("id") long producerId,
                                @RequestParam("projectName") String projectName,
                                @RequestParam("author") String author,
                                @RequestParam("email") String email) {

        List<ProjectEntry> projectList = projectStore.computeIfAbsent(producerId, k -> new ArrayList<>());

        ProjectEntry entry = new ProjectEntry();
        // Per-producer project id (1, 2, 3...)
        entry.setId(projectList.size() + 1);
        entry.setProjectName(projectName);
        entry.setAuthor(author);
        entry.setEmail(email);

        // Magic link fields start empty
        entry.setMagicKey(null);
        entry.setDateSent(null);
        entry.setDateReturned(null);

        // Returned-files flags start as "pending" (false)
        entry.setAlbumUploaded(false);
        entry.setNftUploaded(false);
        entry.setBridgeUploaded(false);
        entry.setMetaUploaded(false);
        // Song slots 1–9 as false
        for (int i = 1; i <= 9; i++) {
            entry.setSongUploaded(i, false);
        }

        projectList.add(entry);

        // Redirect to avoid double-submit on refresh
        return "redirect:/admin/producers/" + producerId + "/projects";
    }

    // POST /admin/producers/{producerId}/projects/{projectId}/send -> send magic link
    @PostMapping("/{producerId}/projects/{projectId}/send")
    public String sendMagicLink(@PathVariable("producerId") long producerId,
                                @PathVariable("projectId") long projectId) {

        List<ProjectEntry> projectList = projectStore.get(producerId);
        if (projectList != null) {
            for (ProjectEntry entry : projectList) {
                if (entry.getId() == projectId) {
                    // Generate a simple magic key and set date sent
                    String key = "P" + producerId + "-" + projectId + "-" +
                            UUID.randomUUID().toString().substring(0, 6);
                    entry.setMagicKey(key);
                    entry.setDateSent(LocalDate.now());
                    // dateReturned stays null until some future action
                    break;
                }
            }
        }

        return "redirect:/admin/producers/" + producerId + "/projects";
    }

    // Simple project entry class + returned-files model
    public static class ProjectEntry {
        private long id;
        private String projectName;
        private String author;
        private String email;

        private String magicKey;
        private LocalDate dateSent;
        private LocalDate dateReturned;

        // Returned files flags
        private boolean albumUploaded;
        private boolean nftUploaded;
        private boolean bridgeUploaded;
        private boolean metaUploaded;
        // Songs 0–9 (we'll use 1–9, index 0 unused)
        private final List<Boolean> songUploaded = new ArrayList<>(Collections.nCopies(10, Boolean.FALSE));

        // ---- Basic fields ----
        public long getId() { return id; }
        public void setId(long id) { this.id = id; }

        public String getProjectName() { return projectName; }
        public void setProjectName(String projectName) { this.projectName = projectName; }

        public String getAuthor() { return author; }
        public void setAuthor(String author) { this.author = author; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        // ---- Magic link fields ----
        public String getMagicKey() { return magicKey; }
        public void setMagicKey(String magicKey) { this.magicKey = magicKey; }

        public LocalDate getDateSent() { return dateSent; }
        public void setDateSent(LocalDate dateSent) { this.dateSent = dateSent; }

        public LocalDate getDateReturned() { return dateReturned; }
        public void setDateReturned(LocalDate dateReturned) { this.dateReturned = dateReturned; }

        // ---- Returned-files flags ----
        public boolean isAlbumUploaded() { return albumUploaded; }
        public void setAlbumUploaded(boolean albumUploaded) { this.albumUploaded = albumUploaded; }

        public boolean isNftUploaded() { return nftUploaded; }
        public void setNftUploaded(boolean nftUploaded) { this.nftUploaded = nftUploaded; }

        public boolean isBridgeUploaded() { return bridgeUploaded; }
        public void setBridgeUploaded(boolean bridgeUploaded) { this.bridgeUploaded = bridgeUploaded; }

        public boolean isMetaUploaded() { return metaUploaded; }
        public void setMetaUploaded(boolean metaUploaded) { this.metaUploaded = metaUploaded; }

        public List<Boolean> getSongUploaded() { return songUploaded; }
        public void setSongUploaded(int index, boolean value) {
            if (index >= 0 && index < songUploaded.size()) {
                songUploaded.set(index, value);
            }
        }

        // ---- Derived fields for view ----

        public String getDateSentFormatted() {
            return (dateSent != null) ? dateSent.toString() : null;
        }

        public String getDateReturnedFormatted() {
            return (dateReturned != null) ? dateReturned.toString() : null;
        }

        // 21-day window: compute days remaining from dateSent to now
        public Long getDaysRemaining() {
            if (dateSent == null) {
                return null;
            }
            long daysUsed = ChronoUnit.DAYS.between(dateSent, LocalDate.now());
            long remaining = 21 - daysUsed;
            if (remaining < 0) remaining = 0;
            return remaining;
        }
    }
}
