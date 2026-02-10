# SEWA Frontend - Santal Engineers Welfare Association

> Official website and member portal for the Santal Engineers Welfare Association

[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-blue)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5-blue)](https://vitejs.dev/)

## 📋 Overview

A modern, professional web application for SEWA built with React, TypeScript, and Tailwind CSS. Features a public-facing website and authenticated member portal.

**Status**: 70% Complete | Production Ready (Public Pages)

## ✨ Features

### ✅ Implemented
- 🎨 **10 Reusable UI Components** - Complete design system
- 🔐 **Authentication System** - Login & Registration (Member/Student)
- 📄 **Public Pages** - Home, About, Organization, Contact
- 📱 **Responsive Design** - Mobile, tablet, desktop
- 🔔 **Toast Notifications** - Global feedback system
- 🎯 **Type-Safe** - Full TypeScript coverage
- ♿ **Accessible** - ARIA labels, keyboard navigation
- 🎨 **Professional Design** - Trust-focused, minimalistic

### 🚧 In Progress
- Dashboard pages
- Admin panel
- Member management
- Calendar & Events
- Publications

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
cd sewa-frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### PowerShell Users
If you encounter "scripts disabled" error:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 📁 Project Structure

```
sewa-frontend/
├── src/
│   ├── api/              # API integration
│   ├── auth/             # Authentication
│   ├── components/       # Reusable components
│   │   ├── ui/          # UI component library
│   │   └── layout/      # Layout components
│   ├── pages/           # Page components
│   │   ├── public/      # Public pages
│   │   ├── auth/        # Auth pages
│   │   └── dashboard/   # Protected pages
│   ├── utils/           # Utilities
│   ├── types/           # TypeScript types
│   └── App.tsx          # Main app component
├── PLAN.md              # Implementation plan
├── BUILD_GUIDE.md       # Detailed build guide
└── QUICKSTART.md        # Quick reference
```

## 🎨 Design System

### Colors
- **Primary**: Deep Green (#164a35) - Official SEWA color
- **Secondary**: Slate (50-950 scale)
- **Accent**: Gold (#D4AF37), Teal (#0d9488)

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold, tight tracking
- **Body**: Regular, comfortable line-height

### Components
- Button (5 variants)
- Input (with validation)
- Select (Headless UI)
- Card (modular)
- Modal (animated)
- Dropdown (menu)
- Spinner (loading)
- Skeleton (placeholder)
- Breadcrumbs (navigation)
- Toast (notifications)

## 🔧 Configuration

### Environment Variables
Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

For production:
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
```

## 📦 Tech Stack

- **Framework**: React 18
- **Language**: TypeScript 5
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **Routing**: React Router v6
- **State**: TanStack Query + Context API
- **Forms**: React Hook Form + Zod
- **UI**: Headless UI
- **Icons**: Heroicons
- **HTTP**: Axios

## 🚀 Deployment

### Build
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Traditional Server
1. Build: `npm run build`
2. Upload `dist/` folder
3. Configure server for SPA routing

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔐 Authentication

### Flow
1. User registers (Member/Student)
2. Admin approves registration
3. User logs in with credentials
4. JWT token stored in localStorage
5. Protected routes accessible

### API Endpoints
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/register/member`
- `POST /api/v1/auth/register/student`

## 📊 Progress

| Category | Progress |
|----------|----------|
| Core Setup | 100% ✅ |
| UI Components | 100% ✅ |
| Layouts | 100% ✅ |
| Authentication | 100% ✅ |
| Public Pages | 80% ✅ |
| Dashboard | 0% 🚧 |
| **Overall** | **70%** |

## 🤝 Contributing

This is a private project for SEWA. For questions or contributions, contact the development team.

## 📄 License

Copyright © 2026 Santal Engineers Welfare Association. All rights reserved.

## 📞 Support

For technical support or questions:
- Email: tech@santalengineers.org
- Website: https://santalengineers.org

---

**Built with ❤️ for the Santal Engineering Community**
