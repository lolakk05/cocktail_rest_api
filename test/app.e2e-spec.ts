import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { DatabaseService } from '../src/database/database.service';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    const prisma = app.get(DatabaseService);
    await prisma.$disconnect();
    await app.close();
  });

  it('should pass no matter what (pozdrawiam jak ktoś ten kod czytal wgl)', () => {
    expect(1 + 1).toBe(2);
  });
});
