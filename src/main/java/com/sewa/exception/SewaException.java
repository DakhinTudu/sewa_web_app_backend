package com.sewa.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

public class SewaException extends RuntimeException {
    public SewaException(String message) {
        super(message);
    }
}

@ResponseStatus(HttpStatus.UNAUTHORIZED)
class InvalidCredentialsException extends SewaException {
    public InvalidCredentialsException() {
        super("Invalid username or password");
    }
}

@ResponseStatus(HttpStatus.FORBIDDEN)
class AccountInactiveException extends SewaException {
    public AccountInactiveException() {
        super("Account is inactive");
    }
}

@ResponseStatus(HttpStatus.FORBIDDEN)
class AccountPendingApprovalException extends SewaException {
    public AccountPendingApprovalException() {
        super("Account is pending approval");
    }
}

@ResponseStatus(HttpStatus.NOT_FOUND)
class UserNotFoundException extends SewaException {
    public UserNotFoundException(String msg) {
        super(msg);
    }
}

@ResponseStatus(HttpStatus.CONFLICT)
class UserAlreadyExistsException extends SewaException {
    public UserAlreadyExistsException(String msg) {
        super(msg);
    }
}

@ResponseStatus(HttpStatus.NOT_FOUND)
class ResourceNotFoundException extends SewaException {
    public ResourceNotFoundException(String resource, String field, Object value) {
        super(String.format("%s not found with %s : '%s'", resource, field, value));
    }
}
