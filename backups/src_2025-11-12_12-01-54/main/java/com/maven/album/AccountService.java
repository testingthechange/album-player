package com.maven.album;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AccountService implements UserDetailsService {

    private final AccountRepository repo;
    private final PasswordEncoder encoder;

    public AccountService(AccountRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;

        // ensure an admin exists
        if (repo.findByUsername("admin").isEmpty()) {
            addAccount("admin", "admin@example.com", "ADMIN", "password");
        }
    }

    public java.util.List<Account> getAll() {
        return repo.findAll();
    }

    public void addAccount(String username, String email, String role, String rawPassword) {
        String hashed = encoder.encode(rawPassword);
        Account account = new Account(username, email, role, hashed);
        repo.save(account);
    }

    // 🔧 Delete account
    public void deleteAccount(Long id) {
        repo.deleteById(id);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Account account = repo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return User.withUsername(account.getUsername())
                .password(account.getPassword())
                .roles(account.getRole())
                .build();
    }
}
