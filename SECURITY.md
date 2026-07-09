# 🔒 Security Policy

The VenueMind AI team takes security seriously. We appreciate your efforts to responsibly disclose vulnerabilities and will make every effort to acknowledge your contributions.

---

## Supported Versions

The following table lists the versions of VenueMind AI currently receiving security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | ✅ Yes              |
| 0.9.x   | ✅ Yes              |
| 0.8.x   | ⚠️ Critical fixes only |
| < 0.8   | ❌ No               |

> **Recommendation:** Always run the latest release to receive the most up-to-date security patches.

---

## Reporting a Vulnerability

If you discover a security vulnerability in VenueMind AI, **please do not open a public GitHub issue.** Instead, report it privately using one of the following methods:

### 📧 Email

Send a detailed report to:

**[security@venumind-ai.dev](mailto:security@venumind-ai.dev)**

### What to Include

Please include as much of the following information as possible to help us triage and resolve the issue quickly:

- **Description** of the vulnerability
- **Steps to reproduce** (proof of concept if available)
- **Affected component** (frontend, backend, API, etc.)
- **Impact assessment** (what an attacker could achieve)
- **Suggested fix** (if you have one)
- Your **name and contact information** (for attribution, if desired)

### 🔐 Encryption

If you need to send sensitive information, please request our PGP public key by emailing the address above with the subject line: `PGP Key Request`.

---

## Response Timeline

We are committed to the following response timeline for reported vulnerabilities:

| Stage                        | Timeframe          |
| ---------------------------- | ------------------ |
| **Acknowledgment**           | Within 48 hours    |
| **Initial Assessment**       | Within 5 business days |
| **Status Update**            | Every 7 days       |
| **Fix Development & Release**| Within 30 days (critical) / 90 days (non-critical) |
| **Public Disclosure**        | Coordinated with reporter |

> **Note:** Timelines may vary depending on the complexity and severity of the issue. We will keep you informed throughout the process.

---

## Scope of Policy

This security policy covers the following components of the VenueMind AI project:

### ✅ In Scope

- **Frontend application** (React + Vite) — XSS, CSRF, injection attacks
- **Backend API server** (Node.js + Express) — authentication, authorization, injection, SSRF
- **AI/LLM integration** — prompt injection, data exfiltration via AI responses
- **Docker configuration** — container escape, insecure defaults
- **CI/CD pipelines** — secrets exposure, supply chain attacks
- **Dependencies** — known vulnerabilities in third-party packages

### ❌ Out of Scope

- Vulnerabilities in third-party services we do not control (e.g., Google Gemini API infrastructure)
- Issues requiring physical access to a server or device
- Social engineering attacks against team members
- Denial-of-service (DoS) attacks against development/staging environments
- Reports from automated scanners without a verified proof of concept

---

## Safe Harbor

We support responsible disclosure. If you act in good faith and in accordance with this policy, we will:

- **Not pursue legal action** against you
- Work with you to **understand and resolve** the issue
- **Credit you** in our security advisories (unless you prefer to remain anonymous)
- Consider you for our **Hall of Fame** (coming soon)

---

## Security Best Practices for Contributors

When contributing code, please follow these security guidelines:

1. **Never commit secrets** (API keys, tokens, passwords) — use environment variables
2. **Sanitize all user input** on both client and server side
3. **Use parameterized queries** for any database operations
4. **Keep dependencies updated** — run `npm audit` regularly
5. **Follow the principle of least privilege** in API route design

---

Thank you for helping keep VenueMind AI and its users safe! 🛡️
