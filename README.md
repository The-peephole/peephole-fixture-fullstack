# Peephole Full-Stack Preview Fixture

This repository is the **Peephole full-stack preview golden-path fixture**.

It is a permanent repository for Peephole test infrastructure. Do not delete, rename, archive, or repurpose this repository without coordinating with the Peephole maintainers. Changing its structure can affect Peephole tests and runtime detection.

The fixture intentionally stays small:

- Vite + React frontend
- Express backend
- Real HTTP communication from the frontend to the backend

It does not use a database, real authentication/session middleware, Docker, SSR, or a monorepo framework.

Historical pinned commits (including the M9 golden-path pin) remain
unchanged and do not declare any secret requirement. As of the M10
generated-secret verification commit, the backend declares exactly one
Peephole-generated secret requirement (`SESSION_SECRET`, see
`backend/.env.example`), solely to exercise Peephole's own generated-secret
provisioning path -- it is never a user-supplied production credential, and
this repository never contains a real secret value. `GET /api/secret-check`
exposes only a SHA-256 digest of the value Peephole injected, never the raw
value itself. The backend also deliberately writes the raw injected value to
its own stdout behind a fixed `PEEPHOLE_M10_SECRET_LOG_PROBE:` prefix; this is
intentional, hostile-by-design fixture behavior used solely to verify that
Peephole's production log pipeline does not forward a sandboxed backend's
stdout into its own systemd journal, not a vulnerability in this fixture.

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
- `GET /api/secret-check`
