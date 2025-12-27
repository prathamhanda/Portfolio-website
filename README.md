# 🚀 Modern Developer Portfolio

> A cutting-edge, AI-powered portfolio website built from the ground up to showcase full-stack development and AI engineering expertise with modern technologies and exceptional performance

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

## 🌟 Live Demo

**[View Live Portfolio →](https://pratham.codes)**

---

## 🎯 Project Overview

This portfolio represents a complete reimagination of what a developer's online presence can be. Built entirely from scratch, it combines intelligent AI search, real-time data integration, and performance-first architecture to create an experience that's both beautiful and functional.

---

## ✨ Exceptional Features

### 🤖 **AI-Powered Command Palette**
- **Google Gemini 2.5 Flash** integration for intelligent, natural language queries
- Context-aware search with intelligent fallback responses
- Real-time exploration of projects, skills, and experience
- **Lightning-fast keyboard shortcuts** (Ctrl+K) for efficient navigation

### 🎨 **Buttery-Smooth Performance**
- Custom **RequestAnimationFrame** animations optimized for 60fps
- **Intersection Observer** based scroll effects with zero jank
- Smart mobile-adaptive system with automatic reduced motion support
- Guaranteed zero layout shift during page interactions

### 📊 **Live Coding Dashboard**
- Real-time integration with **LeetCode, GitHub, GeeksforGeeks, CodeChef, and Codeforces**
- Interactive contribution heatmap with intelligent hover tooltips
- **Custom serverless API proxies** to handle CORS and rate limiting
- Smart caching layer with localStorage and intelligent TTL management

### 🎪 **Premium User Experience**
- Modern **glass morphism** design with seamless dark/light theme switching
- Progressive enhancement philosophy ensuring functionality on any device
- **Mobile-first responsive design** with touch gesture optimizations
- Full accessibility compliance with comprehensive keyboard navigation

### ⚡ **Blazing-Fast Load Times**
- **Vite** build system for instant dev server and optimized production bundles
- Strategic dynamic imports and intelligent code splitting
- Consistent **99+ Lighthouse scores** across all performance metrics
- Global CDN deployment for sub-second load times worldwide

---

## 🛠️ Key Features

### 🔍 **Intelligent Search & Navigation**
- AI-powered natural language query processing
- Fuzzy search across all content
- Command palette with autocomplete
- Smart suggestions and context-aware responses

### 📱 **Responsive & Accessible Design**
- Mobile-first responsive layout
- Dark/Light theme with system preference detection
- Full keyboard navigation support
- Screen reader optimized with ARIA labels

### 📈 **Dynamic Data Integration**
- Real-time coding statistics from multiple platforms
- GitHub contribution visualization
- Live project metrics and performance data
- Automated data caching and refresh

### 🎯 **Project Showcase**
- Interactive project galleries with image carousels
- Detailed technical documentation
- Live demo links and GitHub integration
- Technology stack visualization

### 💫 **Smooth Animations & Interactions**
- Custom floating animations with configurable parameters
- Scroll-triggered reveal animations
- Smooth page transitions
- Optimized for 60fps performance

### 🔧 **Developer Experience**
- TypeScript for type safety
- ESLint + Prettier for code quality
- Component-based architecture
- Comprehensive error handling

---

## 🏗️ Tech Stack

### **Frontend Core**
- **React 18** - Modern React with concurrent features
- **TypeScript** - Type safety and enhanced developer experience
- **Vite** - Lightning-fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework

### **UI Components & Design**
- **ShadcN UI** - High-quality React components
- **Radix UI** - Unstyled, accessible UI primitives
- **Lucide React** - Beautiful, customizable icons
- **next-themes** - Advanced theme management

### **State Management & Data**
- **TanStack Query** - Powerful data synchronization
- **React Hook Form** - Performant forms with validation
- **Zod** - TypeScript-first schema validation

### **AI & External Integrations**
- **Google Gemini AI** - Advanced language model integration
- **GitHub API** - Repository and contribution data
- **LeetCode API** - Competitive programming statistics
- **Recharts** - Data visualization and charts

### **Performance & Analytics**
- **Vercel Analytics** - Real user monitoring
- **Vercel Speed Insights** - Core Web Vitals tracking
- **React Query** - Intelligent caching and background updates

### **Development Tools**
- **ESLint** - Code linting and quality checks
- **PostCSS** - CSS processing and optimization
- **TypeScript ESLint** - TypeScript-specific linting rules

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm**, **yarn**, or **bun** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/prathamhanda/Portfolio-website.git
   cd Portfolio-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory:
   ```env
   # AI Integration
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:8080` to see the application running.

### Building for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

### Deployment

The project is optimized for **Vercel** deployment with zero configuration:

1. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Alternative Deployment Options**
   - **Netlify**: Direct GitHub integration
   - **GitHub Pages**: Using GitHub Actions
   - **Firebase Hosting**: Google Cloud integration

---

## 🎨 Customization Guide

### **Personal Information**
Update your details in `src/lib/aiSearch.ts`:
```typescript
const RESUME_CONTEXT = `
PERSONAL INFORMATION & CONTACT:
Name: Your Name
Role: Your Role
Email: your.email@example.com
// ... update with your information
`;
```

### **Projects Data**
Modify `src/data/projects.ts` to showcase your projects:
```typescript
export const projectsData: Project[] = [
  {
    id: "your-project",
    title: "Your Project Title",
    description: "Project description",
    // ... add your project details
  }
];
```

### **Styling & Theme**
Customize colors and design tokens in `src/index.css`:
```css
:root {
  --primary: your-color-here;
  --background: your-background-color;
  /* ... customize design system */
}
```

### **API Integration**
Update platform usernames in environment variables or component defaults.

---

## 📊 Performance Metrics

- **Lighthouse Score**: 99+ across all categories
- **First Contentful Paint**: < 1.2s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Bundle Size**: < 100KB gzipped

---

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

This project was built from scratch with passion and attention to detail. Special thanks to:

- **The open-source community** for incredible tools and libraries
- **ShadcN** for the elegant UI component patterns
- **Vercel** for world-class deployment and performance infrastructure
- **Radix UI** for accessible, unstyled component primitives
- **Google** for the powerful Gemini AI API

---

## 📬 Contact

**Pratham Handa**
- 🌐 Portfolio: [pratham.codes](https://pratham.codes)
- 💼 LinkedIn: [linkedin.com/in/prathamhanda](https://linkedin.com/in/prathamhanda)
- 🐙 GitHub: [github.com/prathamhanda](https://github.com/prathamhanda)
- 📧 Email: prathamhanda10@gmail.com

---

<div align="center">

**⭐ If you found this project inspiring, consider giving it a star!**

Crafted with ❤️, ☕, and countless hours of refinement by [Pratham Handa](https://github.com/prathamhanda)

</div>


Local push test: 2025-12-27T20:18:53+05:30
