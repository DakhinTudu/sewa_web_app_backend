# React Login Troubleshooting Guide

## Problem: Can login in Swagger but not in React

---

## ✅ What Has Been Fixed

### 1. **Added Enhanced Logging to LoginPage.tsx**
- Console logs for success and error cases
- Detailed error information with status, message, and full error object
- Helps identify exactly where the login is failing

### 2. **Enhanced Axios Configuration** 
- Added request/response logging
- Better error handling with full error details
- Request debugging with URL and method
- Credentials configuration ready

### 3. **Created CORS Configuration** (`src/main/java/com/sewa/config/CorsConfig.java`)
- Although CORS was already in SecurityConfig, this ensures it's properly configured
- Allows requests from React development server (localhost:5173)
- Allows common headers and methods

### 4. **Created Environment Configuration** (`.env.local`)
- Centralized API base URL configuration
- Easy to switch between development and production URLs
- Can be overridden per environment

---

## 🔍 How to Debug Login Issues

### Step 1: Open Browser Developer Console
1. Press `F12` to open Developer Tools
2. Go to **Console** tab
3. Go to **Network** tab

### Step 2: Attempt Login with superadmin / Admin@123

In the **Console**, you should see logs like:
```
🔧 API Base URL: http://localhost:8080/api/v1
🔵 API Request: POST http://localhost:8080/api/v1/auth/login
```

### Step 3: Check Network Tab
- Look for the `/auth/login` request
- Check the **Status** column (should be 200)
- Click on the request and check:
  - **Request Headers** - should have `Content-Type: application/json`
  - **Request Body** - should have username and password
  - **Response** - should have the JWT token and user info

### Step 4: Common Issues and Solutions

#### Issue 1: CORS Error
**Error Message:** `Access to XMLHttpRequest at 'http://localhost:8080/...' from origin 'http://localhost:5173' has been blocked by CORS policy`

**Solution:**
- Make sure backend is running on `http://localhost:8080`
- Check that SecurityConfig has CORS enabled
- Restart the backend after adding CorsConfig.java

#### Issue 2: 404 Not Found
**Error Message:** `404 Not Found` on `/auth/login` request

**Solution:**
- Verify backend is running
- Check the exact endpoint URL in axios configuration
- Ensure baseURL is `http://localhost:8080/api/v1`

#### Issue 3: 400 Bad Request
**Error Message:** `400 Bad Request` response

**Solution:**
- Check request body format - should be:
```json
{
  "username": "superadmin",
  "password": "Admin@123"
}
```
- Verify no extra spaces or formatting issues
- Check backend logs for validation errors

#### Issue 4: 401 Unauthorized
**Error Message:** `401 Unauthorized` response

**Solution:**
- Verify username and password are correct
- Check user exists in database
- Check user account is not locked/disabled
- Check password is correct in database

---

## 📋 Step-by-Step Login Flow

### Frontend (React)

1. **User enters credentials** in LoginPage.tsx
2. **Form validation** with Zod schema (LoginSchema)
3. **Submit button sends request** to `authApi.login()`
4. **axios.ts creates HTTP request** with:
   - URL: `{baseURL}/auth/login` = `http://localhost:8080/api/v1/auth/login`
   - Method: POST
   - Headers: `Content-Type: application/json`
   - Body: `{ username, password }`
5. **Response comes back** with JWT token
6. **AuthProvider.login()** stores token in localStorage
7. **User redirected** to dashboard

### Backend (Spring Boot)

1. **SecurityConfig allows** `/api/v1/auth/**` without authentication
2. **CORS checks** if request origin is allowed
3. **AuthController.login()** receives request
4. **AuthService.login()** validates credentials
5. **JwtUtil generates token** with user claims
6. **Returns AuthResponse** with token, username, roles

---

## 🚀 Testing the Login

### Option 1: Use Browser Console
```javascript
// Test if axios is working
axios.post('http://localhost:8080/api/v1/auth/login', {
    username: 'superadmin',
    password: 'Admin@123'
}).then(res => console.log('✅ Success:', res.data))
  .catch(err => console.error('❌ Error:', err));
```

### Option 2: Use curl (from terminal)
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"superadmin","password":"Admin@123"}'
```

### Option 3: Use Postman
1. Create POST request to `http://localhost:8080/api/v1/auth/login`
2. Set Body to JSON:
```json
{
  "username": "superadmin",
  "password": "Admin@123"
}
```
3. Send request and verify response

---

## 📝 Backend Files to Check

### CorsConfig.java (NEW)
- Location: `src/main/java/com/sewa/config/CorsConfig.java`
- Purpose: Ensures CORS is properly configured
- Action: Backend must be recompiled and restarted

### SecurityConfig.java
- Location: `src/main/java/com/sewa/security/SecurityConfig.java`
- Check: `permitAll()` includes `/api/v1/auth/**`
- Check: `corsConfigurationSource()` includes React dev server origins

### AuthController.java
- Location: `src/main/java/com/sewa/controller/AuthController.java`
- Check: `/login` endpoint exists
- Check: Returns `AuthResponse` with token, username, roles

---

## 📝 Frontend Files to Check

### axios.ts
- Logs API base URL on startup
- Logs all requests and responses
- Handles CORS and other errors

### LoginPage.tsx
- Logs success/error with full details
- Shows user-friendly error messages
- Handles form validation

### .env.local (NEW)
- Sets `VITE_API_BASE_URL=http://localhost:8080/api/v1`
- Can be changed for different environments

---

## ✅ Verification Checklist

- [ ] Backend is running on `http://localhost:8080`
- [ ] Frontend is running on `http://localhost:5173`
- [ ] Open browser DevTools (F12)
- [ ] Check Console tab for API URL logs
- [ ] Check Network tab for login request
- [ ] Verify response status is 200
- [ ] Check response body has token
- [ ] Token is stored in localStorage
- [ ] User is redirected to /dashboard

---

## 🆘 If Still Not Working

1. **Clear browser cache and localStorage:**
   ```javascript
   localStorage.clear()
   location.reload()
   ```

2. **Restart both servers:**
   - Stop React: Press `Ctrl+C` in terminal
   - Stop Backend: Press `Ctrl+C` in Maven terminal
   - Start Backend: `mvn spring-boot:run`
   - Start Frontend: `npm run dev`

3. **Check browser console** for exact error message

4. **Check backend logs** for authentication errors

5. **Verify credentials** in Swagger first

---

## 🎯 Expected Success Flow

After clicking login with correct credentials:

1. ✅ Console shows: `🔵 API Request: POST http://localhost:8080/api/v1/auth/login`
2. ✅ Network tab shows: Status 200 for login request
3. ✅ Console shows: `🟢 API Response: 200 /auth/login`
4. ✅ Console shows: `✅ Login Success: { token: "...", username: "superadmin", roles: [] }`
5. ✅ Toast shows: "Login successful! Redirecting..."
6. ✅ Page redirects to `/dashboard`
7. ✅ localStorage contains `token` and `user`

---

**Last Updated:** 2024  
**Status:** Login Debugging Guide Ready
