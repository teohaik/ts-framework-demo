import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { todosRoute } from './routes/todos.js'

const app = new Hono()

app.use(logger())

// API surface, versioned-ish under /api
app.route('/api/todos', todosRoute)

// Static frontend (plain HTML/JS) served from ./public
app.use('/*', serveStatic({ root: './public' }))

const port = Number(process.env.PORT ?? 3000)

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
