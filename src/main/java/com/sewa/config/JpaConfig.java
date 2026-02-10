package com.sewa.config;

import com.sewa.security.SecurityUser;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.lang.NonNull;

import java.util.Map;
import java.util.Optional;

@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
public class JpaConfig {

    @Bean
    public AuditorAware<Integer> auditorProvider() {
        return new AuditorAware<Integer>() {
            @Override
            @NonNull
            public Optional<Integer> getCurrentAuditor() {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                if (authentication == null || !authentication.isAuthenticated() ||
                        "anonymousUser".equals(authentication.getPrincipal())) {
                    return Optional.empty();
                }

                Object principal = authentication.getPrincipal();
                if (principal instanceof SecurityUser) {
                    return Optional.ofNullable(((SecurityUser) principal).getId());
                }

                // If principal is String (JWT username), try to get userId from details
                Object details = authentication.getDetails();
                if (details instanceof Map) {
                    Object userId = ((Map<?, ?>) details).get("userId");
                    if (userId instanceof Integer) {
                        return Optional.of((Integer) userId);
                    }
                }

                return Optional.empty();
            }
        };
    }
}
