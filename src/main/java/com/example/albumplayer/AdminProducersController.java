package com.example.albumplayer;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/admin/producers")
public class AdminProducersController {

    // In-memory list (only lives while app is running)
    private final List<ProducerAccount> producerList = new ArrayList<>();
    private long nextId = 1L;

    // GET /admin/producers -> show form + list
    @GetMapping
    public String showProducerAccounts(Model model) {
        model.addAttribute("producerList", producerList);
        return "admin/producers";  // matches producers.html
    }

    // POST /admin/producers -> add a new producer and show the same page
    @PostMapping
    public String createProducerAccount(@RequestParam String name,
                                        @RequestParam String company,
                                        @RequestParam String email,
                                        @RequestParam String cell,
                                        Model model) {
        ProducerAccount p = new ProducerAccount();
        p.setId(nextId++);
        p.setName(name);
        p.setCompany(company);
        p.setEmail(email);
        p.setCell(cell);

        producerList.add(p);

        // reload same page with updated list
        model.addAttribute("producerList", producerList);
        return "admin/producers";
    }

    // Simple inner class – matches fields used in the template
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
