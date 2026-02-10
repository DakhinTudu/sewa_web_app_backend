package com.sewa.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        try {
            username = jwtUtils.extractUsername(jwt);
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                // Extract roles, permissions, and userId from JWT instead of hitting DB
                List<String> roles = jwtUtils.extractClaim(jwt, claims -> (List<String>) claims.get("roles"));
                List<String> permissions = jwtUtils.extractClaim(jwt,
                        claims -> (List<String>) claims.get("permissions"));
                Integer userId = jwtUtils.extractClaim(jwt, claims -> (Integer) claims.get("userId"));

                List<SimpleGrantedAuthority> authorities = roles.stream()
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());

                if (permissions != null) {
                    permissions.stream()
                            .map(SimpleGrantedAuthority::new)
                            .forEach(authorities::add);
                }

                // Create a lightweight principal that JpaConfig can use
                // In production, you might create a custom Principal object here
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        username, null, authorities);

                // Add userId to details so JpaConfig can find it without hitting DB
                Map<String, Object> details = new HashMap<>();
                details.put("userId", userId);
                details.put("remoteAddress", request.getRemoteAddr());

                authToken.setDetails(details);
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        } catch (Exception e) {
            // Log as needed or let security handle it
        }
        filterChain.doFilter(request, response);
    }
}
