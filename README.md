# Peephole Full-Stack Preview Fixture

This repository is the **Peephole full-stack preview golden-path fixture**.

It is a permanent repository for Peephole test infrastructure. Do not delete, rename, archive, or repurpose this repository without coordinating with the Peephole maintainers. Changing its structure can affect Peephole tests and runtime detection.

The fixture intentionally stays small:

- Vite + React frontend
- Express backend
- Real HTTP communication from the frontend to the backend

It does not use a database, authentication, secrets, Docker, SSR, or a monorepo framework.

## Local Verification

Start the backend:

```sh
cd backend
npm ci
npm start
```

In a separate terminal, start the frontend:

```sh
cd frontend
npm ci
npm run dev
```

Open the frontend at `http://localhost:5173`. The Vite dev server proxies `/api` requests to the backend at `http://127.0.0.1:3000`, so the page should display:

```text
Hello from Peephole backend
```

Backend endpoints:

- `GET /health`
- `GET /api/hello`
