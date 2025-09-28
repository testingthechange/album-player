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
