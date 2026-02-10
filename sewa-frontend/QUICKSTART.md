# Quick Start Guide - SEWA Frontend

## 🚀 To Build the Project

### Step 1: Enable PowerShell Scripts (One-time setup)
Open PowerShell as Administrator and run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Build for Production
```bash
npm run build
```

The production files will be in the `dist/` folder.

### Step 4: Preview Production Build (Optional)
```bash
npm run preview
```

---

## 📦 What's Included

### ✅ Completed Features (70%)
- **10 UI Components** - Button, Input, Select, Card, Modal, Dropdown, Spinner, Skeleton, Breadcrumbs, Toast
- **Authentication** - Login & Registration (Member/Student)
- **Public Pages** - Home, About, Organization, Contact
- **Layouts** - Navbar, Footer, PublicLayout
- **Routing** - All routes configured
- **Toast Notifications** - Global notification system

### 🚧 Pending Features (30%)
- Dashboard pages
- Admin panel
- Member management
- Calendar/Events
- Publications

---

## 🎨 Design Highlights
- **Professional Design** - Trust-focused, minimalistic
- **Deep Green Primary** - #164a35 (Official SEWA color)
- **Responsive** - Mobile, tablet, desktop
- **Type-Safe** - Full TypeScript coverage
- **Accessible** - ARIA labels, keyboard navigation

---

## 📁 Output
After building, deploy the `dist/` folder to any static hosting:
- Vercel
- Netlify
- GitHub Pages
- Traditional web server

---

## 🔧 Configuration
Update API URL in `src/api/axios.ts` or create `.env`:
```env
VITE_API_BASE_URL=https://your-api-url.com/api/v1
```

---

## 📝 Documentation
See `BUILD_GUIDE.md` for detailed instructions.
