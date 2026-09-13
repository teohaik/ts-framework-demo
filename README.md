# ts-framework-demo

Small, matched "fullstack Todo" apps in three modern TypeScript backend
frameworks, built to compare their structure and idioms side by side.

Each app is independent (own `package.json`, own `node_modules`) and does
the same thing: a REST API under `/api/todos` (`GET`/`POST`/`PATCH`/`DELETE`),
backed by SQLite, serving the same plain HTML/JS frontend as static files —
no separate client build step anywhere.

| App | Framework | HTTP layer | Structuring unit | Persistence wiring |
|---|---|---|---|---|
| [`hono-app`](./hono-app) | [Hono](https://hono.dev) | Node's `http` (via `@hono/node-server`) | plain functions, wired by hand | shared `db.ts` module |
| [`fastify-app`](./fastify-app) | [Fastify](https://fastify.dev) | Fastify | plugins (`app.register`) | shared `db.ts` module |
| [`nestjs-app`](./nestjs-app) | [NestJS](https://nestjs.com) | **Fastify**, via `@nestjs/platform-fastify` | modules + decorators + DI | custom provider (`DATABASE_CONNECTION` token) |

`nestjs-app` deliberately runs on the Fastify adapter rather than Nest's
default (Express) — same Nest application code, swappable HTTP layer
underneath, and a closer comparison against `fastify-app`: same underlying
server, very different amount of structure imposed on top of it.

All three use Node's built-in [`node:sqlite`](https://nodejs.org/api/sqlite.html)
driver — zero npm dependency, zero native build step, plain SQL, one file
per app under `data/` (gitignored, created on first run).

See each app's own README for its structure in more detail.

## Running any of them

```
cd <app>
npm install
npm run dev      # or: npm run build && npm start
open http://localhost:3000
```
