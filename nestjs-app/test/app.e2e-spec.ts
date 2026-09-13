import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module.js';

describe('Todos (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
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
