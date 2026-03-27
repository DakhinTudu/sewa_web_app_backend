# Email from Render (forgot-password & Communications)

## Why Gmail SMTP fails on Render

If you see:

```
MailConnectException: Couldn't connect to host, port: smtp.gmail.com, 587; timeout -1
Caused by: java.net.ConnectException: Operation timed out
```

**Render (and many cloud hosts) block outbound SMTP** (ports 25, 587, 465) to prevent abuse. Your app cannot open a TCP connection to `smtp.gmail.com:587`, so Gmail SMTP will **not work** when the backend runs on Render.

This is a **network restriction**, not wrong credentials.

---

## Use a transactional email provider

Use an SMTP service that works from Render. Common options:

| Provider    | Free tier           |
|------------|----------------------|
| **SendGrid** | 100 emails/day      |
| **Mailgun**  | 1000 emails/month (trial) |
| **Resend**   | 100 emails/day      |

### SendGrid (recommended)

1. Sign up at [sendgrid.com](https://sendgrid.com).
2. **Create an API Key**: Settings → API Keys → Create API Key (full “Mail Send” access). Copy the key.
3. **Verify a Sender**: Settings → Sender Authentication → Single Sender Verification. Add and verify an email (e.g. `noreply@yourdomain.com` or your Gmail for testing). This address will be the “From” address.
4. In **Render → Environment** set:

   | Key | Value |
   |-----|--------|
   | `SEWA_MAIL_HOST` | `smtp.sendgrid.net` |
   | `SEWA_MAIL_PORT` | `587` |
   | `SEWA_MAIL_USERNAME` | `apikey` (literally) |
   | `SEWA_MAIL_PASSWORD` | your SendGrid API key |
   | `SEWA_MAIL_FROM` | the verified sender email (e.g. `noreply@yourdomain.com`) |

5. **Redeploy** the backend.

### Mailgun / Resend

Same idea: get SMTP host, port, username, and password from the provider; set `SEWA_MAIL_*` in Render. If the username is not an email, set `SEWA_MAIL_FROM` to the address you want in the “From” header.

---

## Local development

Gmail SMTP usually works from your machine. Set in `.env` or environment:

- `SEWA_MAIL_HOST=smtp.gmail.com`
- `SEWA_MAIL_PORT=587`
- `SEWA_MAIL_USERNAME=your-gmail@gmail.com`
- `SEWA_MAIL_PASSWORD=your-gmail-app-password`

No need for `SEWA_MAIL_FROM` when using Gmail (the app uses `SEWA_MAIL_USERNAME` as From).
