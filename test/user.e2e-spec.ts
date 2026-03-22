import { App } from 'supertest/types';
import { UserData } from './test-interfaces';
import request from 'supertest';
import { Role } from '@prisma/client';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { Test } from '@nestjs/testing';
import { DatabaseService } from '../src/database/database.service';
import { seedDatabase } from '../src/database/seed';

async function getAuthToken(server: App, userData: UserData) {
  const response = await request(server)
    .post('/auth/login')
    .send({
      login: userData.login,
      password: userData.password,
    })
    .expect(200);

  if (response.status !== 200) {
    console.log('Błąd logowania:', response.body);
  }

  return response.body.access_token;
}

const userData: UserData = {
  login: 'testuser',
  email: 'user@example.com',
  password: 'testpassword',
};

const adminData: UserData = {
  login: 'admin',
  email: 'admin@example.com',
  password: 'adminpassword',
};

const user1 = {
  login: 'testuser',
  email: 'user@example.com',
  password: 'testpassword',
  role: Role.USER,
};

const admin = {
  login: 'admin',
  email: 'admin@example.com',
  password: 'adminpassword',
  role: Role.ADMIN,
};

describe('UserController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: DatabaseService;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(DatabaseService);
    await prisma.$connect();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
    await prisma.cocktail.deleteMany();
    await prisma.ingredient.deleteMany();
    await prisma.ratio.deleteMany();
    await seedDatabase(prisma);
  });

  afterAll(async () => {
    const prisma = app.get(DatabaseService);
    await prisma.$disconnect();
    await app.close();
  });

  describe('/users (GET)', () => {
    it('should return 200 if logged as admin', async () => {
      const tokenValue: string = await getAuthToken(
        app.getHttpServer(),
        adminData,
      );

      const response = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${tokenValue}`)
        .expect(200);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ login: 'admin' }),
          expect.objectContaining({ login: 'testuser' }),
        ]),
      );
    });
  });
});
