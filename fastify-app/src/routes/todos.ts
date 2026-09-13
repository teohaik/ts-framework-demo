import type { FastifyInstance } from 'fastify'
import { TodoService } from '../services/todo.service.js'

interface CreateBody {
  title?: string
}

interface UpdateBody {
  title?: string
  done?: boolean
}

export async function todosRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    return TodoService.list()
  })

  app.post<{ Body: CreateBody }>('/', async (request, reply) => {
    const title = request.body?.title?.trim()
    if (!title) {
      return reply.code(400).send({ error: 'title is required' })
    }
    const todo = TodoService.create(title)
    return reply.code(201).send(todo)
  })

  app.patch<{ Params: { id: string }; Body: UpdateBody }>('/:id', async (request, reply) => {
    const todo = TodoService.update(request.params.id, request.body ?? {})
    if (!todo) {
      return reply.code(404).send({ error: 'not found' })
    }
    return todo
  })

  app.delete<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const removed = TodoService.remove(request.params.id)
    if (!removed) {
      return reply.code(404).send({ error: 'not found' })
    }
    return reply.code(204).send()
  })
}
