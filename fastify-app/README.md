```
npm install
npm run dev
```

```
open http://localhost:3000
```

## Structure

A minimal fullstack shape: Fastify serves both a JSON API and a static
frontend from one process, no separate build step for the client.

```
src/
  index.ts                   # app entry: registers the todos plugin + @fastify/static
  db.ts                       # opens the SQLite file, creates the schema on boot
  routes/todos.ts              # Fastify plugin — routes registered under /api/todos
  services/todo.service.ts    # data layer: prepared statements over SQLite
  types.ts                     # shared types
public/
  index.html                    # plain HTML/JS frontend, talks to /api/todos via fetch
data/
  app.db                         # SQLite database file (created on first run, gitignored)
```

- `GET/POST /api/todos`, `PATCH/DELETE /api/todos/:id` — REST API
- Everything else falls through to `@fastify/static` for `public/`
- Persistence: `node:sqlite` (Node's built-in driver, still flagged
  experimental as of this Node version, but no npm dependency and no native
  build step) — see the sibling apps' READMEs for how the same schema looks
  wired into Hono and Nest.
- Routing is plugin-based (`app.register(todosRoutes, { prefix })`) rather
  than Hono's flat router or Nest's decorators — Fastify's structuring unit
  is the plugin, with encapsulated scope for routes/hooks/decorators.
