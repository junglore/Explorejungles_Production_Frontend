# Junglore Website

## Project Overview

Junglore Website is a cutting-edge web application that brings the wilderness to life through interactive design and engaging user experiences. Built with modern web technologies, the site features:

- 🦁 AI-powered wildlife sightings and identification
- 🚙 Interactive 3D jeep animations and safari simulations  
- 🌿 Immersive jungle-themed design with smooth animations
- 📱 Fully responsive design for all devices
- 🎬 Rich media and community features

## Tech Stack

- **React 18** - Frontend framework with modern hooks and features
- **Vite** - Lightning-fast build tool and development server
- **Three.js** - 3D graphics and animations
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers and abstractions for React Three Fiber
- **GSAP** - Professional-grade animation library
- **Material-UI (MUI)** - React component library and design system
- **Emotion** - Performant CSS-in-JS styling

## Getting Started

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Junglore_Website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/
│   ├── FullPage.jsx              # Main page component with all sections
│   ├── JeepAnimation.jsx         # 3D jeep animation component
│   ├── BiggerFrame/              # Frame components for content sections
│   └── Hyperlink/                # Custom hyperlink components
├── assets/                       # Static assets and images
├── App.jsx                       # Root application component
├── App.css                       # Application-wide styles
├── main.jsx                      # React entry point
└── index.css                     # Global CSS styles

public/
├── assets/                       # Public static assets
└── vite.svg                      # Vite logo
```

## Key Features

### 🎮 Interactive 3D Animations
- Smooth jeep animations using Three.js and GSAP
- Scroll-triggered animations and transitions
- Immersive 3D elements throughout the experience

### 🎨 Modern Design System
- Built with Material-UI components
- Consistent design language and theming
- Responsive layouts for all screen sizes

### ⚡ Performance Optimized
- Vite for fast development and optimized builds
- Code splitting and lazy loading
- Efficient 3D rendering and animations

### 📱 Responsive Experience
- Mobile-first design approach
- Touch-friendly interactions
- Cross-browser compatibility

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build optimized production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

## Development

### Adding New Components
1. Create components in the `src/components/` directory
2. Follow the existing naming conventions
3. Import and use in `FullPage.jsx` or create new route components

### Working with 3D Elements
- Three.js components are located in separate files
- Use `@react-three/fiber` for React integration
- GSAP is used for complex animations and scroll triggers

### Styling Guidelines
- Use Material-UI components when possible
- Emotion CSS-in-JS for custom styling
- Maintain consistent design tokens and spacing

## Contributing

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/amazing-feature`
3. **Commit your changes:** `git commit -m 'Add amazing feature'`
4. **Push to the branch:** `git push origin feature/amazing-feature`
5. **Open a Pull Request**

## Deployment

The project is configured for easy deployment with Vite:

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## Browser Support

- **Chrome** (latest)
- **Firefox** (latest)
- **Safari** (latest)
- **Edge** (latest)

*Note: 3D features require WebGL support*

## License

This project is proprietary and confidential.

---

**Junglore** - Where technology meets the wild 🌿
