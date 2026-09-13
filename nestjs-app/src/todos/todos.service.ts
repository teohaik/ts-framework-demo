import { randomUUID } from 'node:crypto';
import type { DatabaseSync, StatementSync } from 'node:sqlite';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../database/database.provider.js';
import { Todo } from './todo.entity.js';
import { UpdateTodoDto } from './dto/update-todo.dto.js';

// Row shape as it comes back from SQLite (done as 0/1) vs. the Todo shape
// the rest of the app deals in (done as boolean).
interface TodoRow {
  id: string;
  title: string;
  done: number;
  created_at: string;
}

function toTodo(row: TodoRow): Todo {
  return { id: row.id, title: row.title, done: Boolean(row.done), createdAt: row.created_at };
}

@Injectable()
export class TodosService {
  private readonly statements: Record<
    'list' | 'get' | 'insert' | 'updateTitle' | 'updateDone' | 'remove',
    StatementSync
  >;

  constructor(@Inject(DATABASE_CONNECTION) private readonly db: DatabaseSync) {
    this.statements = {
      list: db.prepare('SELECT * FROM todos ORDER BY created_at'),
      get: db.prepare('SELECT * FROM todos WHERE id = ?'),
      insert: db.prepare('INSERT INTO todos (id, title, done, created_at) VALUES (?, ?, ?, ?)'),
      updateTitle: db.prepare('UPDATE todos SET title = ? WHERE id = ?'),
      updateDone: db.prepare('UPDATE todos SET done = ? WHERE id = ?'),
      remove: db.prepare('DELETE FROM todos WHERE id = ?'),
    };

    // Seed a couple of rows on first run so the frontend has something to show.
    if (this.findAll().length === 0) {
      this.create('Explore Nest module structure');
      this.create('Compare with Hono and Fastify structure');
    }
  }

  findAll(): Todo[] {
    return (this.statements.list.all() as unknown as TodoRow[]).map(toTodo);
  }

  findOne(id: string): Todo {
    const row = this.statements.get.get(id) as unknown as TodoRow | undefined;
    if (!row) throw new NotFoundException(`Todo ${id} not found`);
    return toTodo(row);
  }

  create(title: string): Todo {
    const todo: Todo = { id: randomUUID(), title, done: false, createdAt: new Date().toISOString() };
    this.statements.insert.run(todo.id, todo.title, Number(todo.done), todo.createdAt);
    return todo;
  }

  update(id: string, patch: UpdateTodoDto): Todo {
    this.findOne(id); // throws NotFoundException if missing
    if (patch.title !== undefined) this.statements.updateTitle.run(patch.title, id);
    if (patch.done !== undefined) this.statements.updateDone.run(Number(patch.done), id);
    return this.findOne(id);
  }

  remove(id: string): void {
    const { changes } = this.statements.remove.run(id);
    if (changes === 0) throw new NotFoundException(`Todo ${id} not found`);
  }
}
