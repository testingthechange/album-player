#!/bin/bash
set -e

echo "🧹 Cleaning old sources..."
rm -rf src/main/java/com/maven/album/*
rm -rf src/main/resources/templates/admin

mkdir -p src/main/java/com/maven/album
mkdir -p src/main/resources/templates/admin

# ---------------- PlayerApplication.java ----------------
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

# ---------------- AdminController.java ----------------
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

    // ---------------- Dashboard ----------------
    @GetMapping("/dashboard")
    public String dashboard() {
        return "admin/dashboard";
    }

    // ---------------- Master ----------------
    @GetMapping("/master")
    public String master(Model model) {
        model.addAttribute("incomingData", incomingService.getAllIncoming());
        return "admin/master";
    }

    // ---------------- Accounts ----------------
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

    // ---------------- Producers ----------------
    @GetMapping("/producers")
    public String listProducers(Model model) {
        model.addAttribute("producers", producerService.getAll());
        return "admin/producers";
    }

    @GetMapping("/create-producer")
    public String createProducerForm() {
        return "admin/create-producer";
    }

    @PostMapping("/create-producer")
    public String createProducer(
            @RequestParam String name,
            @RequestParam String email
    ) {
        producerService.addProducer(name, email);
        return "redirect:/admin/producers";
    }

    // ---------------- Projects ----------------
    @GetMapping("/projects/{producerId}")
    public String listProjects(@PathVariable Long producerId, Model model) {
        model.addAttribute("projects", projectService.getByProducerId(producerId));
        model.addAttribute("producerId", producerId);
        return "admin/projects";
    }

    @GetMapping("/projects/{producerId}/create")
    public String createProjectForm(@PathVariable Long producerId, Model model) {
        model.addAttribute("producerId", producerId);
        return "admin/create-project";
    }

    @PostMapping("/projects/{producerId}/create")
    public String createProject(
            @PathVariable Long producerId,
            @RequestParam String name,
            @RequestParam String startDate
    ) {
        projectService.createProject(producerId, name, startDate);
        return "redirect:/admin/projects/" + producerId;
    }
}
EOT

# ---------------- dashboard.html ----------------
cat > src/main/resources/templates/admin/dashboard.html <<'EOT'
<!DOCTYPE html>
<html>
<head><title>Dashboard</title></head>
<body>
  <h1>Admin Dashboard</h1>
  <ul>
    <li><a href="/admin/accounts">Accounts</a></li>
    <li><a href="/admin/producers">Producers</a></li>
    <li><a href="/admin/master">Incoming Data</a></li>
  </ul>
</body>
</html>
EOT

# ---------------- accounts.html ----------------
cat > src/main/resources/templates/admin/accounts.html <<'EOT'
<!DOCTYPE html>
<html>
<head><title>Accounts</title></head>
<body>
  <h1>Accounts</h1>
  <form action="/admin/create-user" method="post">
    <input type="text" name="username" placeholder="Username" required>
    <input type="email" name="email" placeholder="Email" required>
    <input type="text" name="role" placeholder="Role" required>
    <button type="submit">Add Account</button>
  </form>
  <table border="1">
    <tr><th>ID</th><th>Username</th><th>Email</th><th>Role</th></tr>
    <tr th:each="acc : ${accounts}">
      <td th:text="${acc.id}"></td>
      <td th:text="${acc.username}"></td>
      <td th:text="${acc.email}"></td>
      <td th:text="${acc.role}"></td>
    </tr>
  </table>
  <a href="/admin/dashboard">Back</a>
</body>
</html>
EOT

# ---------------- producers.html ----------------
cat > src/main/resources/templates/admin/producers.html <<'EOT'
<!DOCTYPE html>
<html>
<head><title>Producers</title></head>
<body>
  <h1>Producers</h1>
  <a href="/admin/create-producer">+ Create New Producer</a>
  <table border="1">
    <tr><th>ID</th><th>Name</th><th>Email</th><th>Projects</th></tr>
    <tr th:each="prod : ${producers}">
      <td th:text="${prod.id}"></td>
      <td>
        <a th:href="@{'/admin/projects/' + ${prod.id}}" th:text="${prod.name}"></a>
      </td>
      <td th:text="${prod.email}"></td>
      <td>
        <a th:href="@{'/admin/projects/' + ${prod.id}}">View Projects</a>
      </td>
    </tr>
  </table>
  <a href="/admin/dashboard">Back</a>
</body>
</html>
EOT

# ---------------- create-producer.html ----------------
cat > src/main/resources/templates/admin/create-producer.html <<'EOT'
<!DOCTYPE html>
<html>
<head><title>Create Producer</title></head>
<body>
  <h1>Create Producer</h1>
  <form action="/admin/create-producer" method="post">
    <input type="text" name="name" placeholder="Name" required>
    <input type="email" name="email" placeholder="Email" required>
    <button type="submit">Add Producer</button>
  </form>
  <a href="/admin/producers">Back to Producers</a>
</body>
</html>
EOT

# ---------------- master.html ----------------
cat > src/main/resources/templates/admin/master.html <<'EOT'
<!DOCTYPE html>
<html>
<head><title>Incoming Data</title></head>
<body>
  <h1>Incoming Data</h1>
  <table border="1">
    <tr><th>ID</th><th>Artist</th><th>Track</th><th>Status</th></tr>
    <tr th:each="rec : ${incomingData}">
      <td th:text="${rec.id}"></td>
      <td th:text="${rec.artist}"></td>
      <td th:text="${rec.track}"></td>
      <td th:text="${rec.status}"></td>
    </tr>
  </table>
  <a href="/admin/dashboard">Back</a>
</body>
</html>
EOT

# ---------------- projects.html ----------------
cat > src/main/resources/templates/admin/projects.html <<'EOT'
<!DOCTYPE html>
<html>
<head><title>Projects</title></head>
<body>
  <h1>Projects for Producer [[${producerId}]]</h1>
  <a th:href="@{'/admin/projects/' + ${producerId} + '/create'}">+ Create New Project</a>
  <table border="1">
    <tr><th>ID</th><th>Name</th><th>Start Date</th><th>Magic Link</th></tr>
    <tr th:each="proj : ${projects}">
      <td th:text="${proj.id}"></td>
      <td th:text="${proj.name}"></td>
      <td th:text="${proj.startDate}"></td>
      <td><a th:href="@{/${proj.magicLink}}" th:text="${proj.magicLink}"></a></td>
    </tr>
  </table>
  <a href="/admin/producers">Back to Producers</a>
</body>
</html>
EOT

# ---------------- create-project.html ----------------
cat > src/main/resources/templates/admin/create-project.html <<'EOT'
<!DOCTYPE html>
<html>
<head><title>Create Project</title></head>
<body>
  <h1>Create Project for Producer [[${producerId}]]</h1>
  <form th:action="@{'/admin/projects/' + ${producerId} + '/create'}" method="post">
    <input type="text" name="name" placeholder="Project Name" required>
    <input type="text" name="startDate" placeholder="Start Date (YYYY-MM-DD)" required>
    <button type="submit">Create</button>
  </form>
  <a th:href="@{'/admin/projects/' + ${producerId}}">Back</a>
</body>
</html>
EOT

echo "✅ Restore complete. Now run: mvn clean package && java -jar target/album-player-0.0.1-SNAPSHOT.jar --server.port=9292"
