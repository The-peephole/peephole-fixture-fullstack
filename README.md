# Peephole Full-Stack Preview Fixture

This repository is the **Peephole full-stack preview golden-path fixture**.

It is a permanent repository for Peephole test infrastructure. Do not delete, rename, archive, or repurpose this repository without coordinating with the Peephole maintainers. Changing its structure can affect Peephole tests and runtime detection.

The fixture intentionally stays small:

- Vite + React frontend
- Express backend
- Real HTTP communication from the frontend to the backend

It does not use real authentication/session middleware, Docker, SSR, or a monorepo framework.

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

Historical M9 and M10 commits remain immutable. The M11 temporary-database
fixture commit adds exactly the `pg` dependency and the `DATABASE_URL`
requirement. `DATABASE_URL` must be injected by Peephole; there is no fallback
database. At startup, the backend uses one PostgreSQL client to perform a
bounded, fixed `CREATE TABLE IF NOT EXISTS` action followed by `SELECT 1`, then
closes the client. `GET /api/db-check` reports only a fixed, non-secret success
or failure state. It never exposes the database URL, hostname, port, or
credentials.

## M12 User-Environment E2E Test

This branch, `test/m12-user-environment`, is a minimal M12 A/B fixture for
checking that a non-sensitive environment variable entered by a user in the
Peephole Chrome Side Panel reaches both the Fullstack Preview backend and its
frontend. Its target/base branch is `main`; it is not a production change.

The three declared variables have deliberately different roles:

- `SESSION_SECRET` is an existing M10 variable automatically generated and
  injected by Peephole. It is checked only through the non-reversible digest
  returned by `/api/secret-check`.
- `DATABASE_URL` is an existing M11 temporary PostgreSQL connection supplied
  by Peephole. It is checked through the fixed-state `/api/db-check` endpoint.
- `APP_GREETING` is the M12 user-entered test value. It is intentionally
  public and is the only value returned verbatim by `/api/config-check`.

For an M12 E2E run, enter a non-sensitive test string such as:

```text
Hello Peephole M12
```

When the Fullstack Preview is opened in the Chrome Side Panel, the existing
backend greeting remains visible and the APP_GREETING area shows
`APP_GREETING: Hello Peephole M12`. If the variable is not provided, the area
instead shows `환경변수가 전달되지 않음`. The loading state is
`환경변수 확인 중`; a failed request shows an error state.

`APP_GREETING` must never contain a password, API key, token, or any other
secret: this fixture intentionally returns its value to the frontend for this
test. `SESSION_SECRET` and `DATABASE_URL` must continue to be supplied by
Peephole rather than entered as M12 user values.

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
- `GET /api/config-check`
- `GET /api/secret-check`
- `GET /api/db-check`
