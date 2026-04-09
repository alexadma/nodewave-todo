# NodeWave Todo App — Frontend Assessment

Aplikasi Todo berbasis Next.js yang dibangun sebagai bagian dari proses rekrutmen Frontend Engineer NodeWave.

## 🔗 Links

- **Live Demo**: [https://nodewave-todo.vercel.app](https://nodewave-todo.vercel.app)
- **API Base URL**: https://fe-test-api.nwappservice.com

---

## ✅ Fitur yang Diimplementasikan

### Mandatory
| Fitur | Status |
|---|---|
| Login | ✅ |
| Register | ✅ |
| Buat Todo baru | ✅ |
| Tandai Todo selesai / belum | ✅ |
| Hapus Todo | ✅ |
| Tampilkan semua Todo | ✅ |
| Filter Todo (status, pencarian) | ✅ |
| Pagination | ✅ |

### Optional
| Fitur | Status |
|---|---|
| Admin Page (lihat semua todo + filter) | ✅ |

---

## 🛠️ Tech Stack

| Kategori | Teknologi |
|---|---|
| Framework | Next.js 14 (App Router) |
| Bahasa | TypeScript |
| CSS | Tailwind CSS |
| UI Kit | Shadcn UI |
| Server State | React Query (TanStack Query) |
| Client State | Zustand |
| HTTP Client | Axios |
| Validasi | Zod + React Hook Form |
| Utility | clsx, date-fns |
| Notifikasi | Sonner |
| Deployment | Vercel |

---

## 📁 Struktur Proyek

```
src/
├── app/                   # Next.js App Router
│   ├── (auth)/            # Halaman publik: login & register
│   ├── (dashboard)/       # Halaman terproteksi: todos
│   └── admin/             # Admin page (optional)
├── components/
│   ├── ui/                # Shadcn auto-generated components
│   ├── auth/              # Form Login & Register
│   ├── todos/             # TodoCard, TodoList, Filter, Dialog
│   └── layout/            # Navbar, ProtectedRoute
├── hooks/                 # Custom hooks (useAuth, useTodos)
├── lib/                   # Konfigurasi axios, react-query
├── schemas/               # Zod validation schemas
├── services/              # API service layer
├── store/                 # Zustand auth store
└── types/                 # TypeScript interfaces
```

---

## 🚀 Setup & Menjalankan Secara Lokal

### Prasyarat
- Node.js >= 18
- npm atau pnpm

### Langkah-langkah

```bash
# 1. Clone repository
git clone https://github.com/USERNAME/nodewave-todo.git
cd nodewave-todo

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env.local
# Edit .env.local sesuai kebutuhan

# 4. Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## 🔑 Environment Variables

Buat file `.env.local` di root project:

```env
NEXT_PUBLIC_API_BASE_URL=https://fe-test-api.nwappservice.com
```

---

## 🏗️ Arsitektur & Keputusan Teknis

### 1. State Management
- **Zustand** digunakan untuk menyimpan state autentikasi (`user`, `token`) yang di-persist ke `localStorage`.
- **React Query** mengelola semua server state (data dari API): caching, refetching, dan invalidasi otomatis setelah mutasi.

### 2. Validasi Form
- Semua form menggunakan **Zod schema** yang dikombinasikan dengan **React Hook Form** via `@hookform/resolvers/zod`.
- Ini memastikan validasi terpusat, konsisten, dan type-safe.

### 3. HTTP Layer
- **Axios instance** terpusat dengan interceptor untuk:
  - Menyertakan `Authorization: Bearer <token>` di setiap request.
  - Redirect ke `/login` otomatis jika respons `401 Unauthorized`.

### 4. Protected Routes
- Komponen `ProtectedRoute` mengecek status autentikasi dari Zustand store.
- Jika belum login, pengguna diarahkan ke halaman `/login`.

### 5. Component Design
- Komponen dipecah berdasarkan tanggung jawab (single responsibility).
- Business logic (API calls, state updates) dienkapsulasi di custom hooks, bukan di komponen UI.

---

## 📖 Panduan Penggunaan

### Register & Login
1. Buka halaman `/register` dan isi form.
2. Setelah registrasi berhasil, akan otomatis masuk ke halaman todos.
3. Untuk login kembali, gunakan halaman `/login`.

### Mengelola Todo
- **Tambah**: Klik tombol **"Tambah Todo"** → isi judul & deskripsi → simpan.
- **Selesaikan**: Klik checkbox di sebelah kiri todo.
- **Hapus**: Klik ikon 🗑️ di sebelah kanan todo.
- **Filter**: Gunakan input pencarian atau dropdown status di atas daftar.

### Admin Page (jika diimplementasi)
- Login dengan akun admin:
  - Email: `admin@nodewave.id`
  - Password: `admin123`
- Akses halaman `/admin` untuk melihat semua todo dari semua pengguna.

---

## 📦 Scripts

```bash
npm run dev      # Jalankan development server
npm run build    # Build untuk production
npm run start    # Jalankan production build
npm run lint     # Cek linting
```

---

## 🚢 Deployment

Aplikasi di-deploy ke **Vercel** secara otomatis dari branch `main`.

Langkah manual:
```bash
npx vercel --prod
```

Pastikan environment variable `NEXT_PUBLIC_API_BASE_URL` sudah diatur di Vercel dashboard.

---

## 👤 Tentang

Dikerjakan sebagai bagian dari **NodeWave Frontend Engineer Assessment**.
