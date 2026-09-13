import { join } from 'node:path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { DatabaseModule } from './database/database.module.js';
import { TodosModule } from './todos/todos.module.js';

@Module({
  imports: [
    DatabaseModule,
    TodosModule,
    // Serves the plain HTML/JS frontend in public/ for any route the API
    // (mounted under /api) doesn't claim.
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
    }),
  ],
})
export class AppModule {}
