package com.sewa.common.aspect;

import com.sewa.entity.AuditLog;
import com.sewa.entity.User;
import com.sewa.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
public class AuditAspect {

    private final AuditLogRepository auditLogRepository;

    @AfterReturning(pointcut = "execution(* com.sewa.service.*.*(..)) && !execution(* com.sewa.service.impl.AuthService.*(..))", returning = "result")
    public void logServiceAction(JoinPoint joinPoint, Object result) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getPrincipal() instanceof User user) {
                String action = joinPoint.getSignature().getName();
                String entity = joinPoint.getTarget().getClass().getSimpleName().replace("Service", "");

                AuditLog logEntry = AuditLog.builder()
                        .user(user)
                        .action(action)
                        .entity(entity)
                        .createdAt(LocalDateTime.now())
                        .build();

                auditLogRepository.save(logEntry);
            }
        } catch (Exception e) {
            log.error("Failed to log audit action", e);
        }
    }
}
