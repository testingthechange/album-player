package com.example.demo.admin;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/admin/producer")
public class AdminProducerController {

    // In-memory list of producers (no DB for now)
    private final List<ProducerAccount> producerList = new ArrayList<>();
    private long nextId = 1L;

    // Show form + list
    @GetMapping
    public String showProducerAccounts(Model model) {
        model.addAttribute("producerList", producerList);
        return "admin/producers"; // producers.html
    }

    // Handle Create button
    @PostMapping
    public String createProducerAccount(@RequestParam String name,
                                        @RequestParam String company,
                                        @RequestParam String email,
                                        @RequestParam String cell) {

        ProducerAccount producer = new ProducerAccount();
        producer.setId(nextId++);
        producer.setName(name);
        producer.setCompany(company);
        producer.setEmail(email);
        producer.setCell(cell);

        producerList.add(producer);

        // reload page with updated list
        return "redirect:/admin/producer";
    }

    // When user clicks [id] Name
    @GetMapping("/{producerId}/projects")
    public String showProducerProjects(@PathVariable long producerId, Model model) {

        ProducerAccount match = producerList.stream()
                .filter(p -> p.getId() == producerId)
                .findFirst()
                .orElse(null);

        model.addAttribute("producerId", producerId);
        model.addAttribute("producer", match); // shows general producer info

        return "admin/projects";
    }

    // Simple inner class for producer data
    public static class ProducerAccount {

        private long id;
        private String name;
        private String company;
        private String email;
        private String cell;

        public long getId() { return id; }
        public void setId(long id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getCompany() { return company; }
        public void setCompany(String company) { this.company = company; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getCell() { return cell; }
        public void setCell(String cell) { this.cell = cell; }
    }
}

