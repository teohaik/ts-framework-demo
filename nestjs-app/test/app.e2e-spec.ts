import { Test, TestingModule } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import request from 'supertest';
import { AppModule } from './../src/app.module.js';

describe('Todos (e2e)', () => {
  let app: NestFastifyApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
    // Fastify defers route registration until the instance is "ready" —
    // supertest talks to the underlying server, so it needs this too.
    await app.getHttpAdapter().getInstance().ready();
  });

  it('/api/todos (GET) lists the seeded todos', async () => {
    const res = await request(app.getHttpServer()).get('/api/todos').expect(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('/api/todos (POST) creates a todo', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/todos')
      .send({ title: 'Write more tests' })
      .expect(201);
    expect(res.body).toMatchObject({ title: 'Write more tests', done: false });
  });

  afterEach(async () => {
    await app.close();
  });
});
