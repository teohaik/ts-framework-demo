import { randomUUID } from 'node:crypto'
import { db } from '../db.js'
import type { Todo } from '../types.js'

// Row shape as it comes back from SQLite (done as 0/1) vs. the Todo shape
// the rest of the app deals in (done as boolean).
interface TodoRow {
  id: string
  title: string
  done: number
  created_at: string
}

function toTodo(row: TodoRow): Todo {
  return { id: row.id, title: row.title, done: Boolean(row.done), createdAt: row.created_at }
}

const statements = {
  list: db.prepare('SELECT * FROM todos ORDER BY created_at'),
  get: db.prepare('SELECT * FROM todos WHERE id = ?'),
  insert: db.prepare('INSERT INTO todos (id, title, done, created_at) VALUES (?, ?, ?, ?)'),
  updateTitle: db.prepare('UPDATE todos SET title = ? WHERE id = ?'),
  updateDone: db.prepare('UPDATE todos SET done = ? WHERE id = ?'),
  remove: db.prepare('DELETE FROM todos WHERE id = ?'),
}

export const TodoService = {
  list(): Todo[] {
    return (statements.list.all() as unknown as TodoRow[]).map(toTodo)
  },

  get(id: string): Todo | undefined {
    const row = statements.get.get(id) as unknown as TodoRow | undefined
    return row ? toTodo(row) : undefined
  },

  create(title: string): Todo {
    const todo: Todo = { id: randomUUID(), title, done: false, createdAt: new Date().toISOString() }
    statements.insert.run(todo.id, todo.title, Number(todo.done), todo.createdAt)
    return todo
  },

  update(id: string, patch: Partial<Pick<Todo, 'title' | 'done'>>): Todo | undefined {
    const existing = this.get(id)
    if (!existing) return undefined
    if (patch.title !== undefined) statements.updateTitle.run(patch.title, id)
    if (patch.done !== undefined) statements.updateDone.run(Number(patch.done), id)
    return this.get(id)
  },

  remove(id: string): boolean {
    return statements.remove.run(id).changes > 0
  },
}

// Seed a couple of rows on first run so the frontend has something to show.
if (TodoService.list().length === 0) {
  TodoService.create('Explore Hono routing')
  TodoService.create('Compare with NestJS and Fastify structure')
}
