# Architectural Choices & Trade-offs — Workbench RBAC

This document outlines the design decisions and technical trade-offs made during the implementation of the Workbench RBAC Permission Builder.

---

## 1. Backend Framework: Express vs. Fastify
- **Choice**: **Express**
- **Rationale**: While Fastify offers slightly better performance and native schema validations, Express is the industry standard for Node.js REST APIs with massive ecosystem support. Since our core business logic and permission engines are decoupled in a thin service layer, we can easily swap Express out for Fastify or Nest.js in the future without changing database or business workflows.

---

## 2. In-Memory Store vs. Database
- **Choice**: **In-Memory JavaScript Arrays** (Preseeded)
- **Rationale**: For this prototype, the assignment requested "In-memory Storage (No Database Required)". We encapsulated all memory interactions inside the `UserRepository` and `RoleRepository` files. This ensures that when transitioning to production, we only need to swap the in-memory arrays for a database client (e.g. Prisma + PostgreSQL) within the repository methods, without touching controllers or services.

---

## 3. Data Representation: TypeScript Interfaces vs. Classes
- **Choice**: **TypeScript Interfaces** for entities (`User`, `Role`, `UserRole`)
- **Rationale**: We chose plain JSON objects typing via Interfaces over class constructors (`new Role()`). Plain data objects are trivially serializable across networks, require zero translation overhead in DB queries, and align perfectly with REST API best practices. Zod is used to handle parsing and runtime type verification rather than OOP constructors.

---

## 4. Permission Resolution: Set-based Union vs. Array Loops
- **Choice**: **JavaScript Set Union**
- **Rationale**:
  - Sets perform native duplicate removal in $O(1)$ time complexity on insertions.
  - Doing array mapping followed by a filter check `array.indexOf()` yields $O(N^2)$ checks.
  - By accumulating permissions into a `Set` and then mapping them to grouped resources, the resolution engine guarantees a clean, fast execution complexity of $O(R \times P)$ where $R$ is the number of roles and $P$ is the average number of permissions.

---

## 5. Frontend State Management: React Context vs. Zustand/Redux
- **Choice**: **React Context API** (`AppContext`)
- **Rationale**: Given the single-page admin panel layout, the state is compact (three main resource lists: users, roles, permissions). Introducing complex stores like Redux Toolkit or Zustand would lead to boilerplate overhead. React Context provides standard reactivity, state-sharing, and is fully integrated with React's lifecycle.
