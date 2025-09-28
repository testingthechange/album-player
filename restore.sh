#!/bin/bash
echo "🔄 Restoring stable album-player..."

# 1. Remove leftover Security files
rm -f src/main/java/com/maven/album/SecurityConfig.java
rm -f src/main/java/com/maven/album/AdminAccount.java
rm -f src/main/java/com/maven/album/AdminAccountService.java

# 2. Kill any process on port 9292
PID=$(lsof -ti :9292)
if [ ! -z "$PID" ]; then
  echo "⚠️  Killing process on port 9292 (PID $PID)..."
  kill -9 $PID
else
  echo "✅ No process found on port 9292."
fi

# 3. PlayerApplication.java
cat > src/main/java/com/maven/album/PlayerApplication.java <<'EOT'
package com.maven.album;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PlayerApplication {
    public static void main(String[] args) {
        SpringApplication.run(PlayerApplication.class, args);
    }
}
EOT

# 4. AdminController.java
cat > src/main/java/com/maven/album/AdminController.java <<'EOT'
package com.maven.album;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private final ProducerService producerService;
    private final ProjectService projectService;
    private final AccountService accountService;
    private final IncomingService incomingService;

    public AdminController(
            ProducerService producerService,
            ProjectService projectService,
            AccountService accountService,
            IncomingService incomingService
    ) {
        this.producerService = producerService;
        this.projectService = projectService;
        this.accountService = accountService;
        this.incomingService = incomingService;
    }

    @GetMapping("/dashboard")
    public String dashboard() {
        return "admin/dashboard";
    }

    @GetMapping("/master")
    public String master(Model model) {
        model.addAttribute("incomingData", incomingService.getAllIncoming());
        return "admin/master";
    }

    @GetMapping("/accounts")
    public String listAccounts(Model model) {
        model.addAttribute("accounts", accountService.getAll());
        return "admin/accounts";
    }

    @PostMapping("/create-user")
    public String createUser(
            @RequestParam String username,
            @RequestParam String email,
            @RequestParam String role
    ) {
        accountService.addAccount(username, email, role, "placeholder");
        return "redirect:/admin/accounts";
    }

    @GetMapping("/producers")
    public String listProducers(Model model) {
        model.addAttribute("producers", producerService.getAll());
        return "admin/producers";
    }

    @PostMapping("/create-producer")
    public String createProducer(
            @RequestParam String name,
            @RequestParam String email
    ) {
        producerService.addProducer(name, email);
        return "redirect:/admin/producers";
    }
}
EOT

# 5. Account.java
cat > src/main/java/com/maven/album/Account.java <<'EOT'
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
EOT

# 6. AccountService.java
cat > src/main/java/com/maven/album/AccountService.java <<'EOT'
package com.maven.album;

import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class AccountService {
    private final List<Account> accounts = new ArrayList<>();
    private long counter = 1;

    public AccountService() {
        addAccount("demoAdmin", "admin@example.com", "ADMIN", "placeholder");
        addAccount("demoUser", "user@example.com", "USER", "placeholder");
    }

    public List<Account> getAll() {
        return accounts;
    }

    public void addAccount(String username, String email, String role, String extraField) {
        Account account = new Account(counter++, username, email, role, extraField);
        accounts.add(account);
    }
}
EOT

# 7. Project.java
cat > src/main/java/com/maven/album/Project.java <<'EOT'
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
EOT

# 8. ProjectService.java
cat > src/main/java/com/maven/album/ProjectService.java <<'EOT'
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
EOT

# 9. IncomingRecord.java
cat > src/main/java/com/maven/album/IncomingRecord.java <<'EOT'
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
EOT

# 10. IncomingService.java
cat > src/main/java/com/maven/album/IncomingService.java <<'EOT'
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
EOT

# 11. Producer.java
cat > src/main/java/com/maven/album/Producer.java <<'EOT'
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
EOT

# 12. ProducerService.java
cat > src/main/java/com/maven/album/ProducerService.java <<'EOT'
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
EOT

# 13. Rebuild
echo "🛠️  Cleaning and rebuilding..."
mvn clean package

# 14. Restart app in background
echo "🚀 Starting application on port 9292..."
nohup java -jar target/album-player-0.0.1-SNAPSHOT.jar --server.port=9292 > app.log 2>&1 &

echo "✅ Done! Application is running. Check logs with: tail -f app.log"
