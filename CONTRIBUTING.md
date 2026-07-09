# 🤝 Contributing to VenueMind AI

Thank you for your interest in contributing to VenueMind AI! This guide will help you get started and ensure a smooth collaboration process.

---

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Standards](#code-standards)
- [Pull Request Process](#pull-request-process)
- [Code of Conduct](#code-of-conduct)

---

## Getting Started

1. **Fork the repository** on GitHub: [nirmal2155/venumind-ai](https://github.com/nirmal2155/venumind-ai)
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/<your-username>/venumind-ai.git
   cd venumind-ai
   ```
3. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. Make your changes, commit, and push to your fork.
5. Open a **Pull Request** against the `main` branch of this repository.

> **First-time contributors:** Look for issues labeled [`good first issue`](https://github.com/nirmal2155/venumind-ai/labels/good%20first%20issue) — these are curated for newcomers.

---

## Development Setup

### Prerequisites

| Tool       | Minimum Version |
| ---------- | --------------- |
| Node.js    | 18.x            |
| npm        | 9.x             |
| Git        | 2.30+           |

### Backend

```bash
cd backend
npm install
cp .env.example .env   # Add your GEMINI_API_KEY
npm start              # Starts the Express server on port 3001
```

### Frontend

```bash
cd frontend
npm install
npm run dev            # Starts the Vite dev server on port 5173
```

### Running Tests

```bash
# Backend tests (Jest + Supertest)
cd backend
npm test

# Frontend tests (Vitest)
cd frontend
npm test
```

---

## Code Standards

### General

- Write **clean, readable code** with meaningful variable and function names.
- Keep functions small and focused — each should do one thing well.
- Add **JSDoc comments** for public functions and complex logic.

### JavaScript / React

- Use **ES Modules** (`import`/`export`) throughout.
- Prefer **functional components** and React Hooks over class components.
- Use **destructuring** for props and state.
- Avoid inline styles; use the project's CSS design system.

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <short summary>

Examples:
feat(chatbot): add Hindi language support
fix(crowd-map): correct heatmap density calculation
docs(readme): update installation instructions
test(backend): add API endpoint integration tests
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`

### Linting

- The frontend uses **OxLint** for fast linting. Run before committing:
  ```bash
  cd frontend
  npx oxlint .
  ```

---

## Pull Request Process

1. **Ensure your branch is up-to-date** with `main`:
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Run all tests** and ensure they pass before opening a PR:
   ```bash
   cd backend && npm test
   cd ../frontend && npm test
   ```

3. **Fill out the PR template** completely, including:
   - A clear description of the change
   - Related issue number (e.g., `Closes #42`)
   - Screenshots or recordings for UI changes
   - Any breaking changes

4. **Request a review** from at least one maintainer.

5. **Address review feedback** promptly. Push additional commits to the same branch — do not force-push during review.

6. **Merge criteria:**
   - ✅ All CI checks pass
   - ✅ At least one approving review
   - ✅ No unresolved conversations
   - ✅ Branch is up-to-date with `main`

> **Note:** Maintainers may squash-merge your PR to keep the commit history clean.

---

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you agree to uphold this code.

**In short:** Be respectful, inclusive, and constructive. Harassment, discrimination, and disruptive behavior will not be tolerated.

If you witness or experience unacceptable behavior, please report it to **[security@venumind-ai.dev](mailto:security@venumind-ai.dev)**.

---

Thank you for helping make VenueMind AI better! 🏟️✨
