```
npm install
npm run dev
```

```
open http://localhost:3000
```

## Structure

A minimal fullstack shape: Hono serves both a JSON API and a static frontend
from one process, no separate build step for the client.

```
src/
  index.ts            # app entry: wires middleware, API routes, static files
  db.ts                 # opens the SQLite file, creates the schema on boot
  routes/todos.ts      # HTTP layer — request/response handling per route
  services/todo.service.ts  # data layer: prepared statements over SQLite
  types.ts             # shared types
public/
  index.html            # plain HTML/JS frontend, talks to /api/todos via fetch
data/
  app.db                 # SQLite database file (created on first run, gitignored)
```

- `GET/POST /api/todos`, `PATCH/DELETE /api/todos/:id` — REST API
- Everything else falls through to `serveStatic` for `public/`
- No framework-level DI or decorators — routing and layering are just plain
  functions/objects, wired together explicitly in `index.ts`
- Persistence: `node:sqlite` (Node's built-in driver, still flagged
  experimental as of this Node version, but no npm dependency and no native
  build step)
