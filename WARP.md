# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Chinese H5 mobile web application (食物卡路里扫描器 - Food Calorie Scanner) that allows users to upload food images for AI-powered recognition and calorie calculation. The app is built as a Progressive Web App (PWA) using vanilla HTML5, CSS3, and JavaScript.

## Common Commands

### Development Server
```bash
# Start development server (Python method)
python -m http.server 8000

# Alternative with Node.js (if http-server is installed)
npm install -g http-server
http-server -p 8000

# Using package.json scripts
npm start
npm run dev
```

### Building
```bash
# Build for production (creates dist directory)
npm run build
```

### Testing
```bash
# Run tests (placeholder - no tests implemented yet)
npm test
```

### Local Development Access
Access the application at: `http://localhost:8000`

## Architecture & Code Structure

### Core Components

**FoodCalorieScanner Class** (`app.js`)
- Main application controller handling all UI interactions and API calls
- Manages file upload, drag-and-drop functionality, image preview, and results display
- Contains mock API implementation and placeholder for real food recognition APIs (Baidu, Tencent, Aliyun, Google, Azure)

**File Processing Pipeline**:
1. Image upload/drag-drop → File validation (type, size) → Preview display
2. User triggers analysis → Loading state → API call → Results display
3. Retry functionality allows users to start over

**UI Sections**:
- Upload area with drag-and-drop support
- Image preview with remove functionality  
- Loading spinner during API calls
- Results card showing food name, calories, nutrition facts, and confidence score
- Retry section for starting over

### API Integration Architecture

The app is designed to support multiple food recognition APIs through a pluggable architecture:

- **Mock Mode**: Currently active with hardcoded food data for development
- **API Providers**: Baidu AI, Tencent Cloud, Aliyun, Google Cloud Vision, Azure Computer Vision
- **Configuration**: API keys managed through `config.js` (copied from `config.example.js`)
- **Error Handling**: Comprehensive error handling for API failures and validation

### PWA Implementation

The app includes PWA setup:
- Service Worker registration in `app.js` (looks for `/sw.js`)
- PWA configuration in `package.json` with Chinese app name and theme colors
- Responsive design optimized for mobile devices

### Styling System

**CSS Architecture**:
- Mobile-first responsive design using CSS Grid and Flexbox
- CSS custom properties (variables) for theme colors
- Gradient backgrounds and modern UI with backdrop-filter effects
- Animation support with CSS transitions and keyframes

**Key Design Patterns**:
- Card-based layout with rounded corners and shadows
- Glassmorphism effects with backdrop-filter blur
- Color scheme: Primary (#4A90E2), gradients with purple tones
- Font Awesome icons throughout the interface

## API Configuration

### Setting Up Real API Integration

1. Copy `config.example.js` to `config.js`
2. Add your API credentials for chosen provider(s)
3. Update `APP_SETTINGS.DEFAULT_PROVIDER` in config
4. Set `APP_SETTINGS.MOCK_MODE` to `false`
5. The app will automatically switch from mock data to real API calls

### Supported APIs
- **Baidu AI**: Food dish recognition API
- **Tencent Cloud**: Image recognition service  
- **Aliyun**: Visual intelligence platform
- **Google Cloud Vision**: Label detection
- **Azure Computer Vision**: Image analysis

## Development Notes

### File Structure
- `index.html` - Main application page with semantic HTML structure
- `app.js` - Single JavaScript file containing all application logic
- `styles.css` - Complete CSS styling with mobile-first approach
- `config.example.js` - Template for API configuration
- No build process required - static files served directly

### Key Development Considerations

**Image Processing**:
- File validation: JPG/PNG only, 5MB max size
- Base64 conversion for API upload
- Responsive image preview with aspect ratio preservation

**State Management**:
- Simple state management within FoodCalorieScanner class
- UI state controlled through display property toggling
- Global window.foodScanner instance available for debugging

**Error Handling**:
- User-friendly error messages in Chinese
- Console logging for debugging
- Graceful fallback to mock data when APIs fail

### Mobile Optimization
- Touch-friendly UI with adequate tap targets
- `capture="environment"` attribute on file input for camera access
- Viewport meta tag for proper mobile rendering
- CSS media queries for responsive breakpoints

## Security Considerations

- API keys should never be committed to version control
- `config.js` is gitignored for security
- Consider using environment variables or server-side proxy for API calls in production
- File upload validation prevents malicious file types

## Deployment Options

The README mentions several deployment strategies:
- **GitHub Pages**: Static site hosting
- **Vercel/Netlify**: JAMstack deployment
- **Any static file server**: Pure HTML/CSS/JS application

Since this is a client-side only application with no server dependencies, deployment is straightforward with any static hosting provider.
