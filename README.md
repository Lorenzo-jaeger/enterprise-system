# Enterprise System

A scalable, production-ready full-stack application built with **NestJS** and **Next.js**.

## 🚀 Technologies

### Backend (Server)
- **Framework:** NestJS
- **Database:** PostgreSQL (via Docker)
- **ORM:** Prisma
- **Authentication:** JWT, Passport, BCrypt
- **Architecture:** Modular with RBAC (Role-Based Access Control)

### Frontend (Client)
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **UI Architecture:** Atomic Design
- **Components:** Shadcn UI
- **State Management:** Zustand

## 📂 Project Structure

This project follows a Monorepo structure:

- `client/`: Next.js Frontend application.
- `server/`: NestJS Backend application.

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18+)
- Docker Desktop (for Database)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Lorenzo-jaeger/enterprise-system.git
   ```

2. Install dependencies for both client and server:
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

3. Start the Database:
   ```bash
   docker-compose up -d
   ```

4. Run the applications:
   - **Backend**: `cd server && npm run start:dev` (Runs on http://localhost:3000)
   - **Frontend**: `cd client && npm run dev` (Runs on http://localhost:3001)

## 🤝 Contribution

1. Create a feature branch from `homolog`.
2. Commit your changes.
3. Open a Pull Request to `homolog`.

## 📝 License

This project is licensed under the MIT License.
