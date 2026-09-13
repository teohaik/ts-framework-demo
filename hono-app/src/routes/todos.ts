import { Hono } from 'hono'
import { TodoService } from '../services/todo.service.js'

export const todosRoute = new Hono()

todosRoute.get('/', (c) => {
  return c.json(TodoService.list())
})

todosRoute.post('/', async (c) => {
  const body = await c.req.json<{ title?: string }>().catch(() => ({} as { title?: string }))
  const title = body.title?.trim()
  if (!title) {
    return c.json({ error: 'title is required' }, 400)
  }
  const todo = TodoService.create(title)
  return c.json(todo, 201)
})

todosRoute.patch('/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req
    .json<{ title?: string; done?: boolean }>()
    .catch(() => ({} as { title?: string; done?: boolean }))
  const todo = TodoService.update(id, body)
  if (!todo) {
    return c.json({ error: 'not found' }, 404)
  }
  return c.json(todo)
})

todosRoute.delete('/:id', (c) => {
  const id = c.req.param('id')
  const removed = TodoService.remove(id)
  if (!removed) {
    return c.json({ error: 'not found' }, 404)
  }
  return c.body(null, 204)
})
