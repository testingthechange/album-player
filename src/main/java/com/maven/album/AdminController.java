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
