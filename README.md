# Workbench — RBAC Permission Builder

Workbench is a production-grade, full-stack prototype of a Role-Based Access Control (RBAC) Permission Builder for SaaS organizations. It allows administrators to build custom roles, select specific permissions, associate multiple roles with team members, and view resolved access privilege matrix maps in real time using a deterministic union-based merge engine.

---

## 🚀 Quick Start (Local Run)

### Prerequisites
- Node.js (v20+)
- npm (v10+)
- *Or* Docker & Docker Compose (for containerized execution)

### 1. Run via Docker Compose (Recommended)
You can build and start both the frontend dashboard and backend server on a unified virtual bridge network:
```bash
docker-compose up --build
```
Once started:
- **Frontend Dashboard**: View at [http://localhost:3000](http://localhost:3000)
- **Backend API**: Health endpoint at [http://localhost:5000/health](http://localhost:5000/health)

---

### 2. Manual Local Setup

#### Clone & Workspace Setup
```bash
git clone <repository-url>
cd "Custom Role & Permission Builder"
```

#### Running the Backend API
1. Open a new terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Boot the development hot-reloaded API server:
   ```bash
   npm run dev
   ```
   The backend server runs at [http://localhost:5000](http://localhost:5000).

#### Running the Frontend Dashboard
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   The dashboard runs at [http://localhost:5173](http://localhost:5173) (or the next available port).

---

## 🛠️ Project Structure
```
workspace/
├── backend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── controllers/      # Thin controller layer
│   │   │   ├── routes/           # Endpoint mapping
│   │   │   └── middleware/       # Logger, Zod validation, error handler
│   │   ├── services/             # Core business logic & resolution engine
│   │   ├── repositories/         # Memory store CRUD isolation
│   │   ├── models/               # TypeScript models
│   │   ├── schemas/              # Zod schema definitions
│   │   ├── data/                 # Seed data lists
│   │   ├── tests/                # Vitest & Supertest integration tests
│   │   └── server.ts             # Bootstrapping Express configuration
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   ├── pages/                # App view pages
│   │   ├── layouts/              # Navigation frame and headers
│   │   ├── store/                # AppContext global state manager
│   │   ├── services/             # Fetch client API operations
│   │   ├── types/                # Component type assertions
│   │   ├── constants/            # Hardcoded permission matrix definition
│   │   ├── index.css             # CSS styling variables
│   │   └── App.tsx               # Main routing router
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml
├── DESIGN.md                     # Deep technical architectures
├── CHOICES.md                    # Engineering trade-offs
├── TESTING.md                    # Verification cases log
└── API_COLLECTION.json           # Postman JSON Collection file
```

---

## 🛡️ Core Security & Resolution Engine
- **Deterministic Merge**: Workbench merges overlapping roles via a union-based deduplication algorithm, guaranteeing that multiple roles resolve to exactly one set of unique privileges.
- **Complexity**: $O(R \times P)$ computation latency ($R$ roles, $P$ permissions) ensures fast sub-millisecond calculation scales.
- **Locked System Roles**: Seeded system configurations (`Owner`, `Admin`, `Member`, `Viewer`) are protected from edits or deletion to prevent locked-out states.
- **Cascade Deletes**: Deleting a custom role cascades updates to all mapped users automatically, safely unassigning them in-place.

---

## 📖 API Documentation Summary

### Permissions
- `GET /api/permissions`: Lists the supported resource/action permission matrix.

### Roles
- `GET /api/roles`: Lists all preseeded and custom roles.
- `GET /api/roles/:id`: Fetches a single role's configuration.
- `POST /api/roles`: Creates a new custom role.
- `PUT /api/roles/:id`: Updates an existing custom role (modifying descriptions and permission arrays).
- `DELETE /api/roles/:id`: Deletes a custom role (triggers cascading unassignments from users).

### Users
- `GET /api/users`: List users and their assigned roles.
- `POST /api/users/:id/roles`: Assigns a role to a user.
- `DELETE /api/users/:id/roles/:roleId`: Removes a role assignment.
- `GET /api/users/:id/effective-permissions`: Computes and returns the net merged permissions matrix for a user.

---

## 🧪 Running Automated Tests
The backend integration test suite runs via **Vitest**:
```bash
cd backend
npm run test
```
The test runner executes 13 integration test cases covering validations, cascading role deletions, duplicate checks, and permission merges.
For more details, see [TESTING.md](file:///c:/Users/Asus/Desktop/Custom%20Role%20&%20Permission%20Builder/TESTING.md).

---

## 📂 Documentation Links
- **Technical Design**: [DESIGN.md](file:///c:/Users/Asus/Desktop/Custom%20Role%20&%20Permission%20Builder/DESIGN.md)
- **Trade-off Analysis**: [CHOICES.md](file:///c:/Users/Asus/Desktop/Custom%20Role%20&%20Permission%20Builder/CHOICES.md)
- **Validation & Test Cases**: [TESTING.md](file:///c:/Users/Asus/Desktop/Custom%20Role%20&%20Permission%20Builder/TESTING.md)
