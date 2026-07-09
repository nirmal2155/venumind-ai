# Changelog

All notable changes to **VenueMind AI** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-07-09

### Added
- 🛡️ OWASP Security Headers middleware (X-Content-Type-Options, X-Frame-Options, XSS-Protection, Referrer-Policy, Permissions-Policy)
- 📊 Structured JSON Request Logger for production observability
- 🏥 `/api/health` endpoint for monitoring and CI/CD readiness checks
- 💾 Offline-first state persistence in EmergencyContext via localStorage
- 🧠 `useMemo` optimization in useMatchTimer hook to reduce CPU usage
- 📚 Enterprise documentation: LICENSE (MIT), CONTRIBUTING.md, SECURITY.md, CODE_OF_CONDUCT.md
- 🐳 `docker-compose.yml` with health checks and multi-service orchestration
- ⚙️ `.editorconfig` for cross-IDE code consistency

### Changed
- Updated README.md with CI badge, project structure, security and testing sections
- Updated backend `package.json` with proper metadata and start script

## [1.1.0] - 2026-07-08

### Added
- 🤖 AI Text-to-Speech (Voice Synthesis) on Concierge chat messages
- ⏱️ Live Command Center Clock widget in Header
- 🛡️ Global React Error Boundary with themed fallback UI
- ⚙️ GitHub Actions CI/CD pipeline (`ci.yml`) for automated testing and build
- 📱 PWA `manifest.json` and theme-color meta tags
- 🚀 Sci-Fi Boot Splash Screen animation sequence

### Changed
- Wrapped `BottomNav` in `React.memo` to prevent unnecessary re-renders
- Refactored timer logic into shared `useMatchTimer` custom hook
- Reduced bottom navigation to 4 professional buttons (Hub, Maps, AI Chat, Ops)

## [1.0.0] - 2026-07-08

### Added
- 🏟️ **Dashboard** — Real-time match overview with AI-powered crowd predictions
- 🗺️ **Maps & Navigation** — Interactive stadium maps with 3D isometric views
- 💬 **AI Concierge** — Multilingual chatbot (8 languages) with Gemini AI integration
- 📡 **Operations Center** — Live gate flow telemetry and AI-generated alerts
- 👥 **Crowd Analytics** — Predictive density monitoring with automated rerouting
- 👨‍💼 **Staff Hub** — Role-specific AI briefings for security, medics, and stewards
- ♿ **Accessibility Hub** — High contrast, large text, voice navigation, wheelchair routing
- 🎤 Voice input (Web Speech API) for hands-free interaction
- 🌐 Backend API with Express.js and Google Gemini AI integration
- 🐳 Multi-stage Dockerfile for production deployment
- 🧪 Unit tests with Vitest (frontend) and Jest + Supertest (backend)
