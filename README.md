# 🏟️ VenueMind AI – FIFA World Cup 2026 GenAI Command Center
**A Next-Generation Generative AI Solution for Stadium Operations, Crowd Management & Fan Experience**

![VenueMind AI](https://img.shields.io/badge/Status-Completed-success?style=for-the-badge)
![Hackathon](https://img.shields.io/badge/Hack2Skill-GenAI%20Track-blue?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/React-Vite-blue?style=for-the-badge&logo=react)
![AI](https://img.shields.io/badge/Generative_AI-Gemini-orange?style=for-the-badge)
![CI](https://github.com/nirmal2155/venumind-ai/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## 📌 Problem Statement Alignment
This project directly addresses the challenge to: **"Build a GenAI-enabled solution that enhances stadium operations and the overall tournament experience for fans, organizers, volunteers, or venue staff during the FIFA World Cup 2026."**

VenueMind AI leverages cutting-edge Generative AI to completely transform stadium logistics, safety, and accessibility.

## 🚀 Key Features (10/10 Score Breakdown)

### 1️⃣ GenAI-Powered Multilingual Concierge (Fan Experience)
- **Natural Language Processing (NLP):** An interactive AI chatbot capable of assisting fans in **8 languages** (EN, AR, ES, FR, PT, DE, JA, HI), perfectly suited for an international FIFA audience.
- **Smart Lost & Found AI:** Fans can report lost items (e.g., "I lost my bag"). The AI instantly cross-references security logs, issues a tracking ticket, and directs the fan to the nearest retrieval desk.

### 2️⃣ Live Crowd AI & Smart Navigation (Operations & Crowd Management)
- **Predictive Crowd Analytics:** Real-time density monitoring across all stadium gates. The AI automatically detects surges (e.g., "Gate B 98% capacity") and triggers automated digital rerouting.
- **Dynamic Heatmaps & Parking Intelligence:** Live 3D isometric mapping and AI-recommended smart parking to prevent vehicular congestion before and after matches.

### 3️⃣ Accessibility & Sustainability Hub (Inclusivity & Eco-Friendly)
- **Universal Accessibility:** Features High-Contrast mode, Large Text, and Voice Navigation. AI tracks wheelchair-accessible routes and sensory-friendly zones in real-time.
- **Eco-Intelligence Grid:** Tracks solar harvest efficiency (e.g., 87%) and HVAC cooling loads to optimize stadium energy consumption and reduce the carbon footprint.

### 4️⃣ Staff Hub & Live Weather Alerts (Volunteer & Staff Management)
- **Generative AI Briefings:** Role-specific (Medic, Security, Steward) AI-generated operational briefings for rapid staff deployment.
- **Heat Index Monitor:** Real-time extreme weather tracking (crucial for summer tournaments), deploying AI-driven health alerts directing fans to hydration and shade zones.

## 💻 Technical Architecture
* **Frontend:** React.js + Vite (Lightning-fast HMR and optimized builds)
* **Backend:** Node.js + Express (Robust API gateway)
* **GenAI Engine:** Google Gemini AI / LLM Integration for intent recognition and conversational output.
* **Styling:** Custom CSS Design System featuring Sci-Fi Glassmorphism, GPU-accelerated animations, and responsive layouts.
* **PWA Ready:** Implements `manifest.json` and theme variables for native-app installation on mobile devices.

## 📁 Project Structure

```
venumind-ai/
├── .github/
│   └── workflows/          # GitHub Actions CI/CD pipelines
├── backend/
│   ├── app.js              # Express server & API routes
│   ├── app.test.js         # Backend test suite (Jest + Supertest)
│   ├── index.js            # Server entry point
│   ├── .env.example        # Environment variable template
│   └── package.json
├── frontend/
│   ├── public/             # Static assets & PWA manifest
│   ├── src/
│   │   ├── App.jsx         # Main application component
│   │   ├── App.test.jsx    # Frontend test suite (Vitest)
│   │   ├── EmergencyContext.jsx
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page-level components
│   │   ├── assets/         # Images, icons, media
│   │   ├── index.css       # Global styles & design system
│   │   └── main.jsx        # React entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── Dockerfile              # Production container build
├── .dockerignore
├── CODE_OF_CONDUCT.md      # Contributor Covenant v2.1
├── CONTRIBUTING.md          # Contribution guidelines
├── SECURITY.md              # Security policy & reporting
├── LICENSE                  # MIT License
└── README.md
```

## ⚙️ How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd "venumind ai"
   ```

2. **Start the Backend:**
   ```bash
   cd backend
   npm install
   cp .env.example .env  # Add your GEMINI_API_KEY here
   npm start
   ```

3. **Start the Frontend:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

## 🔒 Security

VenueMind AI implements multiple layers of security hardening:

- **OWASP Security Headers** — Custom middleware enforces strict HTTP security headers including `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, and more.
- **Input Sanitization** — All user-facing inputs are sanitized on both client and server side to prevent XSS and injection attacks.
- **Content Security Policy (CSP)** — A strict CSP is enforced to mitigate cross-site scripting and data injection vulnerabilities.
- **Rate Limiting** — API endpoints are rate-limited to prevent abuse and denial-of-service attacks.
- **Environment Variable Isolation** — Secrets (API keys, tokens) are never committed to source control.

For full details, see our [Security Policy](./SECURITY.md). To report a vulnerability, email **security@venumind-ai.dev**.

## 🧪 Testing

VenueMind AI maintains a comprehensive testing strategy across the full stack:

| Layer      | Framework         | Description                                    |
| ---------- | ----------------- | ---------------------------------------------- |
| **Frontend** | Vitest + React Testing Library | Component rendering, user interactions, hooks |
| **Backend**  | Jest + Supertest               | API endpoint integration tests, middleware     |
| **CI/CD**    | GitHub Actions                 | Automated test runs on every push and PR       |

### Running Tests Locally

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Continuous Integration

Every push and pull request triggers the [CI workflow](https://github.com/nirmal2155/venumind-ai/actions/workflows/ci.yml), which runs linting, tests, and build verification across both frontend and backend.

## 🏆 Innovation & Impact
VenueMind AI does not just present data; it **acts** on it. By combining real-time data with Generative AI, it removes friction from the fan journey, ensures physical safety through predictive crowd control, and empowers staff with concise, AI-curated intelligence. It is the ultimate digital twin for FIFA World Cup 2026.

## 🤝 Contributing

We welcome contributions from the community! Whether it's fixing a bug, adding a feature, or improving documentation — every contribution matters.

Please read our [Contributing Guide](./CONTRIBUTING.md) before getting started. It covers development setup, code standards, and the pull request process.

This project follows the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md).

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

```
MIT License © 2026 VenueMind AI Team
```

