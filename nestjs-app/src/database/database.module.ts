import { Global, Module } from '@nestjs/common';
import { databaseProvider, DATABASE_CONNECTION } from './database.provider.js';

// @Global so any feature module can inject DATABASE_CONNECTION without
// importing DatabaseModule itself — imported once, from AppModule.
@Global()
@Module({
  providers: [databaseProvider],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
