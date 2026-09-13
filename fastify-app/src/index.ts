import path from 'node:path'
import fastifyStatic from '@fastify/static'
import Fastify from 'fastify'
import { todosRoutes } from './routes/todos.js'

const app = Fastify({ logger: true })

// API surface, versioned-ish under /api, registered as a plugin (Fastify's
// unit of composition — routes, hooks and decorators scoped to a prefix).
await app.register(todosRoutes, { prefix: '/api/todos' })

// Static frontend (plain HTML/JS) served from ./public
await app.register(fastifyStatic, {
  root: path.join(process.cwd(), 'public'),
})

const port = Number(process.env.PORT ?? 3000)

try {
  await app.listen({ port })
} catch (err) {
  app.log.error(err)
  process.exit(1)
}
