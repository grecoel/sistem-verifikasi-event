# 🔒 Panduan Keamanan

## Fitur Keamanan yang Diimplementasikan

### 1. **Autentikasi JWT** 🔐
- Token berbasis JSON Web Token
- Expiry time 24 jam
- Secret key konfigurasi via environment variable
- Header format: `Authorization: Bearer <token>`

### 2. **Rate Limiting** ⏱️
- **General API**: 100 request per 15 menit per IP
- **Login Endpoint**: 5 percobaan per 15 menit per IP
- Headers rate limit info disertakan dalam response

### 3. **Input Validation** ✅
- Validasi semua input menggunakan express-validator
- Sanitasi data untuk mencegah injection
- Length validation untuk semua string input
- Type validation untuk semua numeric input

### 4. **Security Headers** 🛡️
- Content Security Policy (CSP)
- HTTP Strict Transport Security (HSTS)
- X-Frame-Options untuk mencegah clickjacking
- X-Content-Type-Options
- Referrer Policy

### 5. **Role-Based Access Control (RBAC)** 👥
```javascript
// Operator role
- Buat izin acara baru
- Edit izin acara milik sendiri
- Hapus izin acara milik sendiri
- Lihat izin acara milik sendiri

// Verifikator role  
- Lihat semua izin acara untuk verifikasi
- Verifikasi/tolak izin acara
- Lihat riwayat verifikasi
```

### 6. **Password Security** 🔒
- Hashing menggunakan bcryptjs
- Salt rounds: 12
- Tidak pernah menyimpan plain text password

## Konfigurasi Keamanan

### Environment Variables Wajib
```env
# JWT Secret (WAJIB diganti untuk production)
JWT_SECRET=kunci-rahasia-jwt-yang-sangat-kuat-dan-acak

# Database dengan credentials yang aman
DATABASE_URL=mysql://user:strongpassword@localhost:3306/db_name

# CORS origin yang spesifik
CORS_ORIGIN=https://yourdomain.com
```

### Headers Keamanan Otomatis
```http
Content-Security-Policy: default-src 'self'
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

## Best Practices untuk Production

### 1. **Environment Security**
```bash
# Gunakan secrets management
# Jangan commit .env ke git
# Gunakan different secrets untuk setiap environment
```

### 2. **Database Security**
```sql
-- Buat user khusus untuk aplikasi
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON event_permission_system.* TO 'app_user'@'localhost';

-- Jangan gunakan root user untuk aplikasi
```

### 3. **Server Security**
```bash
# Gunakan HTTPS di production
# Setup firewall rules
# Regular security updates
# Monitor access logs
```

### 4. **API Security**
```javascript
// Selalu validate input
// Implement pagination untuk large datasets
// Log semua critical operations
// Monitor untuk suspicious activity
```

## Monitoring & Logging

### Security Events yang Dilog
- Failed login attempts
- Rate limit violations
- Invalid token access attempts
- Privilege escalation attempts
- Suspicious query patterns

### Log Format
```javascript
{
  timestamp: "2025-07-07T10:30:00Z",
  level: "SECURITY",
  event: "FAILED_LOGIN",
  ip: "192.168.1.100",
  user_agent: "...",
  details: {
    username: "attempted_username",
    reason: "invalid_password"
  }
}
```

## Response to Security Incidents

### 1. **Brute Force Detection**
- Otomatis block IP setelah 5 failed attempts
- Log semua attempts dengan detail
- Alert admin jika threshold terlampaui

### 2. **Invalid Token Usage**
- Log semua invalid token attempts
- Track IP addresses yang suspicious
- Auto-ban setelah threshold tertentu

### 3. **Data Access Violations**
- Log attempts untuk akses data di luar permission
- Alert untuk privilege escalation attempts
- Automatic session termination untuk violations

## Security Checklist untuk Deployment

- [ ] JWT secret yang kuat dan unique
- [ ] Database credentials yang aman
- [ ] HTTPS enabled
- [ ] CORS configured dengan domain spesifik
- [ ] Rate limiting enabled
- [ ] Input validation active
- [ ] Security headers configured
- [ ] Logging dan monitoring setup
- [ ] Firewall rules configured
- [ ] Regular backup strategy
- [ ] Security update schedule
- [ ] Incident response plan

## Vulnerability Reporting

Jika menemukan vulnerability, laporkan ke:
- Email: security@yourcompany.com
- Sertakan detail langkah reproduce
- Jangan publikasikan sebelum patch tersedia
