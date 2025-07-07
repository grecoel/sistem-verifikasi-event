# Sistem Perizinan Acara & Verifikasi

Sistem manajemen perizinan acara dengan GraphQL API dan sistem verifikasi berbasis role.

## Overview Project

Sistem ini memungkinkan **Operator** untuk mengajukan izin penyelenggaraan acara dan **Verifikator** untuk memverifikasi pengajuan tersebut. Dibangun dengan teknologi modern untuk performa dan keamanan yang optimal.

## 🛠️ Tech Stack

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **Node.js** | 18+ | Runtime JavaScript |
| **Apollo Server** | 4.12.2 | GraphQL Server |
| **Drizzle ORM** | 0.44.2 | Database ORM |
| **MySQL** | 8.0+ | Database |
| **GraphQL** | 16.11.0 | API Query Language |
| **JWT** | 9.0.2 | Authentication |
| **Express** | 5.1.0 | Web Framework |
| **TypeScript/TSX** | 4.20.3 | Development Tools |

## 📁 Struktur Folder

```
sistem-perizinan-acara-verifikasi/
├── 📁 src/
│   ├── 📁 db/                    # Konfigurasi Database
│   │   ├── index.js              # Koneksi database
│   │   ├── migrate.js            # Script migrasi
│   │   ├── seeds.js              # Data awal
│   │   └── 📁 schema/            # Skema tabel
│   │       └── index.js          # Definisi semua tabel
│   ├── 📁 graphql/               # GraphQL Setup
│   │   ├── index.js              # Server Apollo
│   │   ├── 📁 typeDefs/          # Skema GraphQL
│   │   │   ├── base.js           # Query/Mutation dasar
│   │   │   ├── scalars.js        # Tipe data custom
│   │   │   ├── user.js           # Skema pengguna
│   │   │   ├── reference.js      # Data referensi
│   │   │   ├── eventPermission.js # Skema izin acara
│   │   │   └── index.js          # Gabungan semua skema
│   │   ├── 📁 resolvers/         # Resolver GraphQL
│   │   │   ├── scalars.js        # Resolver scalar
│   │   │   ├── user.js           # Resolver pengguna
│   │   │   ├── reference.js      # Resolver referensi
│   │   │   ├── eventPermission.js # Resolver izin acara
│   │   │   └── index.js          # Gabungan resolver
│   │   ├── 📁 dataSources/       # Sumber Data
│   │   │   ├── UserAPI.js        # API pengguna
│   │   │   ├── ReferenceAPI.js   # API referensi
│   │   │   ├── EventPermissionAPI.js # API izin acara
│   │   │   └── index.js          # Factory data source
│   │   └── 📁 middleware/        # Middleware
│   │       └── auth.js           # Autentikasi JWT
│   └── 📁 services/              # Layanan bisnis
├── 📁 docs/                      # Dokumentasi
├── server.js                     # Entry point server
├── drizzle.config.js            # Konfigurasi Drizzle
├── package.json                 # Dependencies
├── .env.example                 # Template environment
└── README.md                    # Dokumentasi utama
```

## ⚡ Quick Start

### 1. **Instalasi Dependencies**
```bash
npm install
```

### 2. **Setup Environment**
```bash
# Salin template environment
copy .env.example .env

# Edit file .env dengan kredensial database Anda
```

### 3. **Setup Database**
```bash
# Jalankan migrasi database
npm run migrate

# Tambah data awal (opsional)
npm run seed
```

### 4. **Jalankan Server**
```bash
# Mode development (hot reload)
npm run dev

# Mode production
npm start
```

### 5. **Akses API**
Buka browser: `http://localhost:4000/graphql`

## 🔐 Autentikasi

Sistem menggunakan JWT (JSON Web Token) untuk autentikasi:

1. **Login** dengan username/password
2. **Dapatkan token** JWT
3. **Sertakan token** di header request:
   ```
   Authorization: Bearer <your-jwt-token>
   ```

### Role Pengguna
- **OPERATOR**: Dapat membuat, edit, dan hapus izin acara milik sendiri
- **VERIFIKATOR**: Dapat memverifikasi izin acara yang diajukan operator

## 🧪 Testing

### Contoh Query Testing
```graphql
# Test koneksi database
query TestKoneksi {
  getProvinsi {
    id
    nama
    kode
  }
}

# Test dengan filter
query TestFilter {
  getKategoriAcara(isActive: true) {
    id
    nama
    deskripsi
  }
}

# Test pagination
query TestPagination {
  getEventPermissionList(pagination: {
    take: 5
    skip: 0
    search: "seminar"
    sort: "created_at"
    sortDirection: "desc"
  }) {
    data {
      id
      nama_acara
      penyelenggara
    }
    total
    totalFiltered
  }
}
```

## 🔧 Commands Tersedia

```bash
# Development
npm run dev              # Jalankan server development
npm start                # Jalankan server production

# Database
npm run migrate          # Jalankan migrasi database
npm run seed            # Tambah data awal
npm run db:generate     # Generate file migrasi
npm run db:push         # Push perubahan skema
npm run db:studio       # Buka Drizzle Studio

# Code Quality
npm run lint            # Jalankan ESLint
npm run lint:fix        # Fix ESLint errors otomatis
npm run format          # Format code dengan Prettier
npm run format:check    # Check format code
npm run quality         # Jalankan lint + format check
```

## 🔒 Keamanan

### Fitur Keamanan
- ✅ JWT token untuk autentikasi
- ✅ Role-based access control (RBAC)
- ✅ Rate limiting (100 req/15min general, 5 req/15min login)
- ✅ Input validation & sanitization
- ✅ SQL injection protection (Drizzle ORM)
- ✅ Security headers (CSP, HSTS, dll)
- ✅ Password hashing (bcryptjs)
- ✅ Request logging & monitoring

### Environment Security
```env
# Gunakan secret yang kuat untuk production
JWT_SECRET=kunci-rahasia-jwt-yang-sangat-kuat-dan-acak-minimal-32-karakter

# Gunakan HTTPS di production
FRONTEND_URL=https://yourdomain.com
```

## ⚡ Performance

### Optimasi Database
- ✅ Connection pooling MySQL
- ✅ Database indexing untuk query cepat
- ✅ Query optimization dengan Drizzle
- ✅ Pagination untuk large datasets

### Optimasi GraphQL
- ✅ Apollo Server caching
- ✅ Query complexity analysis
- ✅ DataLoader untuk batch operations
- ✅ Response compression

### Monitoring
- ✅ Request duration logging
- ✅ Memory usage monitoring
- ✅ Slow query detection
- ✅ Error rate tracking

## 🎨 Code Quality

### Linting & Formatting
- **ESLint**: Static analysis untuk detect issues
- **Prettier**: Code formatting yang konsisten
- **Husky**: Git hooks untuk quality checks
- **Lint-staged**: Run linters pada staged files

### Git Hooks
```bash
# Pre-commit hook (otomatis)
- Jalankan ESLint dan fix errors
- Format code dengan Prettier
- Validate commit message

# Pre-push hook (otomatis)
- Jalankan full quality check
- Ensure tests pass (jika ada)
```

### Coding Standards
- Konsisten naming convention (camelCase untuk variables, PascalCase untuk classes)
- Komentar dalam bahasa Indonesia
- Maximum function complexity: 10
- Maximum function length: 50 lines
- No magic numbers (gunakan constants)

## 📊 Monitoring & Logging

### Log Levels
- **INFO**: Normal operations
- **WARN**: Slow queries, deprecated usage
- **ERROR**: Errors yang perlu attention
- **SECURITY**: Failed logins, rate limits, violations

### Metrics yang Ditrack
- Request duration & frequency
- Database query performance
- Memory & CPU usage
- Error rates by endpoint
- User activity patterns

## 📄 License

This project is licensed under the MIT License.
