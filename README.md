# 🚀 Bespoke Clone Factory

> A modern, AI-powered portfolio website showcasing full-stack development and AI engineering expertise with cutting-edge technologies and performance optimizations.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

## 🌟 Live Demo

**[View Live Portfolio →](https://pratham.codes)**

---

## 🎯 Problem Statement

Traditional portfolio websites suffer from several critical limitations:

- **Static Information**: Fixed content that doesn't adapt to visitor queries
- **Poor Discoverability**: Difficult to find specific information about skills, projects, or experience
- **Limited Interactivity**: Basic scrolling interfaces without intelligent search capabilities
- **Performance Issues**: Heavy frameworks leading to slow load times and poor mobile experience
- **Accessibility Gaps**: Poor keyboard navigation and screen reader support

**Solution**: A next-generation portfolio that combines AI-powered search, performance optimization, and accessibility-first design to create an engaging, discoverable, and fast user experience.

---

## ✨ Unique Selling Points (USPs)

### 🤖 **AI-Powered Command Palette**
- **Google Gemini 2.5 Flash** integration for natural language queries
- Intelligent fallback system with contextual responses
- Real-time search across projects, skills, and experience
- **Keyboard shortcuts** (Ctrl+K) for power users

### 🎨 **Performance-Optimized Animations**
- Custom **RequestAnimationFrame** animations running at 60fps
- **Intersection Observer** based scroll animations
- Mobile-adaptive animation system with reduced motion support
- Zero layout shift during animations

### 📊 **Real-Time Coding Dashboard**
- Multi-platform integration: **LeetCode, GitHub, GeeksforGeeks, CodeChef**
- Interactive contribution heatmap with hover tooltips
- **Serverless API proxies** to bypass CORS restrictions
- Intelligent caching with localStorage and TTL

### 🎪 **Advanced User Experience**
- **Glass morphism** design with dynamic theming
- Progressive enhancement with graceful degradation
- **Mobile-first responsive design** with touch optimizations
- Comprehensive accessibility with keyboard navigation

### ⚡ **Lightning-Fast Performance**
- **Vite** for instant dev server and optimized builds
- Dynamic imports and code splitting
- **99+ Lighthouse score** across all metrics
- Edge-deployed with global CDN

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
   git clone https://github.com/prathamhanda/bespoke-clone-factory.git
   cd bespoke-clone-factory
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
   
   # Platform Usernames (Optional - defaults provided)
   VITE_GITHUB_USERNAME=your_github_username
   VITE_LEETCODE_USERNAME=your_leetcode_username
   VITE_GFG_USERNAME=your_geeksforgeeks_username
   VITE_CODECHEF_USERNAME=your_codechef_username
   VITE_CODEFORCES_USERNAME=your_codeforces_username
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

- **ShadcN** for the excellent UI component library
- **Vercel** for seamless deployment and analytics
- **Radix UI** for accessible primitives
- **Google** for Gemini AI integration
- **Open Source Community** for the amazing tools and libraries

---

## 📬 Contact

**Pratham Handa**
- 🌐 Portfolio: [pratham.codes](https://pratham.codes)
- 💼 LinkedIn: [linkedin.com/in/prathamhanda](https://linkedin.com/in/prathamhanda)
- 🐙 GitHub: [github.com/prathamhanda](https://github.com/prathamhanda)
- 📧 Email: prathamhanda10@gmail.com

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

Made with ❤️ and ☕ by [Pratham Handa](https://github.com/prathamhanda)

</div>

