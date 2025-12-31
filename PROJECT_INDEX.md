# Junglore KE Frontend - Comprehensive Project Index

## 📋 Project Overview

**Junglore** is a modern wildlife conservation and education platform built with React, focusing on interactive user experiences, educational content, and community engagement. The platform combines 3D animations, quiz systems, media galleries, and educational resources to create an immersive wildlife learning experience.

## 🏗️ Technical Architecture

### Core Technology Stack

**Frontend Framework:**
- React 18.3.1 with functional components and hooks
- Vite 6.3.5 for build tooling and development server
- JavaScript ES6+ (no TypeScript)

**UI & Styling:**
- Material-UI (MUI) 6.1.6 for component library
- Emotion for CSS-in-JS styling
- Custom Helvetica Neue font family
- Responsive design with custom breakpoints

**3D & Animations:**
- Three.js 0.151.3 for 3D graphics
- @react-three/fiber 8.13.7 for React integration
- @react-three/drei 9.80.7 for 3D utilities
- GSAP 3.13.0 for smooth animations

**Routing & Navigation:**
- React Router DOM 7.6.2 for client-side routing
- Protected routes for authenticated content

**State Management:**
- React Context API for global state
- Custom hooks for component-specific state
- Local Storage for user preferences and auth tokens

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components (Login, Signup, etc.)
│   ├── common/          # Shared components (Header, Footer, ErrorBoundary)
│   ├── game/            # Game-related components
│   ├── quiz/            # Quiz system components
│   └── ui/              # Base UI components (Button, Input, etc.)
├── pages/               # Route-based page components
│   ├── home/           # Landing page and homepage components
│   ├── resources/      # Educational content pages
│   ├── media/          # Media gallery and podcast pages
│   ├── community/      # Community features
│   ├── profile/        # User profile management
│   └── about/          # About and company information
├── services/           # API integration and business logic
├── contexts/           # React Context providers
├── hooks/              # Custom React hooks
├── styles/             # Global CSS files
├── assets/             # Static assets (images, fonts, icons)
├── utils/              # Utility functions
└── tests/              # Test files
```

## 🔐 Authentication System

### Architecture
- **Context Provider**: `AuthContext.jsx` manages global auth state
- **Service Layer**: `auth.js` handles API interactions
- **Token Management**: JWT access tokens with refresh tokens
- **Route Protection**: `ProtectedRoute` component for authenticated routes

### Authentication Flow
1. **Registration**: Email-based signup with OTP verification
2. **Login**: Email/password authentication with JWT tokens
3. **Password Reset**: OTP-based password reset flow
4. **Email Verification**: Required for account activation
5. **Auto-refresh**: Automatic token refresh on API calls

### Auth Components
- `Login.jsx` - User login form
- `Signup.jsx` - User registration form
- `ForgotPassword.jsx` - Password reset request
- `ResetPassword.jsx` - New password entry
- `ResetPasswordOTP.jsx` - OTP verification
- `VerifyEmail.jsx` - Email verification
- `VerifyEmailSent.jsx` - Verification confirmation

## 🌐 API Integration

### Core API Service (`api.js`)
- **Base URL**: Configurable via `VITE_API_BASE_URL`
- **Error Handling**: Comprehensive error typing and user-friendly messages
- **Request Interceptors**: Automatic auth token attachment
- **Retry Logic**: Configurable retry attempts for failed requests
- **Timeout Management**: 30-second request timeout
- **Loading States**: Integration with global loading context

### Specialized Services

#### Content Service (`contentService.js`)
- **Blog Posts**: CRUD operations for blog content
- **Case Studies**: Wildlife conservation case studies
- **Daily Updates**: News and daily wildlife updates
- **Conservation Efforts**: Conservation project content
- **Search**: Cross-content search functionality
- **Caching**: Response caching for performance

#### Quiz Service (`quizService.js`)
- **Quiz Management**: Fetch available quizzes with filtering
- **Quiz Taking**: Submit answers and get real-time results
- **User History**: Track completed quizzes and scores
- **Leaderboards**: Community quiz rankings
- **Progress Tracking**: Individual question timing
- **Validation**: Client-side submission validation

#### Media Service (`mediaService.js`)
- **Gallery Management**: Image and video gallery
- **Podcast Integration**: Audio content streaming
- **File Upload**: Media file upload with validation
- **Image Optimization**: URL optimization for different display contexts
- **Caching**: Aggressive caching for media content
- **Error Handling**: Podcast-specific error boundaries

## 🎯 Key Features

### 1. Educational Content System
- **4 Content Types**: Blogs, Case Studies, Conservation Efforts, Daily Updates
- **Search & Filter**: Advanced content discovery
- **Rich Media**: Integrated images, videos, and interactive elements
- **SEO Optimization**: Meta tags and structured data

### 2. Interactive Quiz System
- **Difficulty Levels**: Beginner to Advanced wildlife knowledge
- **Real-time Scoring**: Instant feedback on answers
- **Progress Tracking**: Individual question timing and overall performance
- **Leaderboards**: Community competition features
- **Question Types**: Multiple choice with image support

### 3. Media Gallery & Podcasts
- **Image Gallery**: Wildlife photography showcase
- **Video Content**: Educational wildlife videos
- **Podcast Integration**: Audio content with streaming capabilities
- **Photographer Attribution**: Credit system for content creators
- **National Park Tags**: Location-based content organization

### 4. 3D Interactive Elements
- **Rotating Earth**: Three.js animated globe
- **Jeep Animations**: GSAP-powered vehicle animations
- **Scroll Animations**: Parallax and reveal effects
- **Interactive Models**: Clickable 3D wildlife models

### 5. Community Features
- **User Profiles**: Customizable user profiles
- **Livestreaming**: Real-time video streaming capability
- **Category Browsing**: Wildlife category exploration
- **Social Features**: Follow/unfollow functionality

### 6. FaunaBot Chatbot
- **AI Integration**: Wildlife knowledge chatbot
- **Interactive Q&A**: Real-time conversation
- **Context Awareness**: Learns from user interactions
- **Educational Support**: Helps with quiz preparation

## 🧠 State Management

### Global Context Providers

#### AuthContext
- **User State**: Current user information and authentication status
- **Auth Methods**: Login, logout, signup, profile updates
- **Token Management**: Automatic token refresh and storage
- **Permission Checking**: Admin role verification

#### LoadingContext
- **Global Loading**: Application-wide loading states
- **Operation Tracking**: Specific API operation loading
- **Progress Tracking**: File upload and processing progress
- **Error Integration**: Automatic error notification

### Custom Hooks

#### Data Management Hooks
- `useAsyncOperation.js` - Async operation state management
- `useLoadingState.js` - Component-level loading states
- `useGameState.js` - Quiz and game state management

#### Performance Hooks
- `useImagePreloader.js` - Image preloading for better UX
- `useAudioPreloader.js` - Audio file preloading
- `useLazyImage.js` - Lazy image loading implementation

## 🎨 UI Component System

### Base Components (`ui/`)
- **Button Components**: Various button styles and states
- **Input Components**: Form inputs with validation
- **Loading Components**: Spinners, skeletons, progress bars
- **Media Components**: Image viewers, audio players
- **Navigation Components**: Links, breadcrumbs

### Composite Components
- **BiggerFrame**: Content container with animations
- **ErrorBoundary**: Error handling wrapper
- **LazyImage**: Performance-optimized image loading
- **AudioPlayer**: Custom audio control interface

### Layout Components (`common/`)
- **Header**: Navigation and user menu
- **Footer**: Links and company information
- **ScrollToTop**: Automatic page scroll management
- **ProtectedRoute**: Authentication-based routing

## 🧪 Testing Strategy

### Unit Testing (Vitest)
- **Test Framework**: Vitest with jsdom environment
- **Component Testing**: React Testing Library integration
- **Service Testing**: API service and utility function tests
- **Hook Testing**: Custom hook behavior verification
- **Coverage**: HTML and JSON coverage reports

### E2E Testing (Cypress)
- **User Flows**: Complete user journey testing
- **Authentication**: Login/logout flow testing
- **Content Management**: CRUD operation testing
- **Media Integration**: Podcast and gallery testing
- **Admin Panel**: Administrative function testing
- **Cross-browser**: Chrome, Firefox, Edge testing

### Test Files
- `mythsFactsService.test.js` - Service layer testing
- `MythsVsFacts.test.jsx` - Component integration testing
- `useGameState.test.js` - Custom hook testing
- Multiple Cypress E2E scenarios

## 🔧 Development Environment

### Build Configuration
- **Vite Config**: React plugin with path aliases
- **Proxy Setup**: API proxy for development server
- **Environment Variables**: Configurable API endpoints
- **Hot Reload**: Instant development feedback

### Code Quality
- **ESLint**: Code linting with React-specific rules
- **Prettier**: Code formatting (configured via ESLint)
- **Git Hooks**: Pre-commit code quality checks

### Performance Optimization
- **Code Splitting**: Route-based code splitting
- **Lazy Loading**: Component and image lazy loading
- **Caching**: Aggressive caching for API responses
- **Bundle Analysis**: Vite bundle analyzer integration

## 🚀 Deployment & Production

### Build Process
- **Production Build**: Optimized bundle creation
- **Asset Optimization**: Image and font optimization
- **Environment Config**: Production API endpoints
- **Static Asset Handling**: Efficient asset serving

### Environment Variables
```bash
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

## 📊 Backend Integration

### Expected Backend APIs
Based on the recommended tech stack (`TechStackBackend.md`):

- **Node.js + Express** or **Python + FastAPI**
- **PostgreSQL** for primary data storage
- **Redis** for caching and session management
- **JWT** authentication with refresh tokens
- **S3** or similar for media file storage
- **WebSocket** support for real-time features

### API Endpoints Structure
```
/api/v1/
├── auth/              # Authentication endpoints
├── blogs/             # Blog content CRUD
├── casestudies/       # Case study management
├── conservation-efforts/  # Conservation content
├── dailynews/         # Daily updates
├── quizzes/           # Quiz system
├── media/             # Media gallery
└── search/            # Content search
```

## 🔮 Future Enhancements

### Planned Features
- **Real-time Notifications**: WebSocket-based notifications
- **Advanced Analytics**: User behavior tracking
- **Mobile App**: React Native companion app
- **Offline Support**: PWA with offline capabilities
- **Multi-language**: Internationalization support

### Technical Improvements
- **TypeScript Migration**: Gradual TypeScript adoption
- **Performance Monitoring**: Real user monitoring
- **Advanced Caching**: Redis integration
- **SEO Enhancement**: Server-side rendering options

## 🤝 Contributing

### Development Workflow
1. **Environment Setup**: Node.js 18+, npm install
2. **Development Server**: `npm run dev`
3. **Testing**: `npm run test` for unit tests
4. **E2E Testing**: `npm run test:e2e`
5. **Build**: `npm run build`

### Code Standards
- **Component Structure**: Functional components with hooks
- **State Management**: Context for global, local for component state
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Performance**: Lazy loading and optimization best practices

---

*This project index provides a comprehensive overview of the Junglore KE Frontend codebase structure, architecture decisions, and implementation details. It serves as a reference for developers working on the project and stakeholders seeking to understand the technical implementation.*