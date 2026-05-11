# Project Vision
Multi-client server web application with built-in stateless access security, engineered for rapid development velocity. Designed to curate and share inspiring wisdom from the world's brightest minds.

# Architecture & Technologies

[Public Web] (Vercel) / [Dashboard] (Local) --> [FastAPI Service] (Cloud/Docker) --> [PostgreSQL]

### Clients (Decoupled & Modern)
*Public Website & Admin Dashboard*
- **React / Next.js** (App Router)
- **TypeScript** for robust type safety
- **Shadcn UI** for high-speed, consistent UI development
- **Deployment:** Vercel (automated via GitHub Actions)

### Server-Backend (Stateless Headless Microservice)
*Central Logic & API*
- **FastAPI** (High-performance Python REST API)
- **Pydantic** for automated data validation
- **SQLAlchemy** (Advanced ORM layer)
- **SlowApi** for integrated rate limiting
- **Deployment:** Coolify on dedicated VPS (automated via GitHub Actions)
- **Containerization:** Fully Dockerized for environment parity

### Database Layer
- **PostgreSQL** (Production-grade reliability)
- **SQLite** (Initial local development & rapid prototyping)
- **Containerization:** Isolated Docker service
