import { App } from 'supertest/types';
import { UserData } from './test-interfaces';
import request from 'supertest';
import { Role } from '@prisma/client';
import { INestApplication, ValidationPipe } from '@nestjs/common';
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
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
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

    it('should return 200 if logged as user', async () => {
      const tokenValue: string = await getAuthToken(
        app.getHttpServer(),
        userData,
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

    it('should return 401 if not logged in', async () => {
      await request(app.getHttpServer()).get('/users').expect(401);
    });

    it('should return 401 if token is invalid', async () => {
      await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', 'Bearer invalidtoken')
        .expect(401);
    });
  });

  describe('/users (POST)', () => {
    it('should return 201 if user created by admin', async () => {
      const tokenValue: string = await getAuthToken(
        app.getHttpServer(),
        adminData,
      );

      const response = await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${tokenValue}`)
        .send({
          login: 'newuser',
          email: 'new@example.com',
          password: 'newpassword',
        })
        .expect(201);

      expect(response.body).toEqual(
        expect.objectContaining({ login: 'newuser' }),
      );
    });

    it('should return 403 if user created by non-admin', async () => {
      const tokenValue: string = await getAuthToken(
        app.getHttpServer(),
        userData,
      );

      await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${tokenValue}`)
        .send({
          login: 'newuser',
          email: 'new@example.com',
          password: 'newpassword',
        })
        .expect(403);
    });

    it('should return 401 if not logged in', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send({
          login: 'newuser',
          email: 'new@example.com',
          password: 'newpassword',
        })
        .expect(401);
    });

    it('should return 400 if data is invalid', async () => {
      const tokenValue: string = await getAuthToken(
        app.getHttpServer(),
        adminData,
      );

      await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${tokenValue}`)
        .send({
          login: '',
          email: 'invalidemail',
          password: 'short',
        })
        .expect(400);
    });
  });

  describe('/users/:id (GET)', () => {
    it('should return 200 if admin requests any user by ID', async () => {
      const adminInDb = await prisma.user.findFirstOrThrow({
        where: { login: 'admin' },
      });
      const tokenValue: string = await getAuthToken(
        app.getHttpServer(),
        adminData,
      );

      const response = await request(app.getHttpServer())
        .get(`/users/${adminInDb.userId}`)
        .set('Authorization', `Bearer ${tokenValue}`)
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({ login: 'admin', email: adminInDb.email }),
      );
    });

    it('should return 200 if user requests their own profile by ID', async () => {
      const userInDb = await prisma.user.findFirstOrThrow({
        where: { login: 'testuser' },
      });
      const tokenValue: string = await getAuthToken(
        app.getHttpServer(),
        userData,
      );

      const response = await request(app.getHttpServer())
        .get(`/users/${userInDb.userId}`)
        .set('Authorization', `Bearer ${tokenValue}`)
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({ login: 'testuser' }),
      );
    });

    it('should return 200 if regular user tries to access another user profile', async () => {
      const adminInDb = await prisma.user.findFirstOrThrow({
        where: { login: 'admin' },
      });
      const tokenValue: string = await getAuthToken(
        app.getHttpServer(),
        userData,
      );

      await request(app.getHttpServer())
        .get(`/users/${adminInDb.userId}`)
        .set('Authorization', `Bearer ${tokenValue}`)
        .expect(200);
    });

    it('should return 401 if unauthenticated user tries to access any profile', async () => {
      const adminInDb = await prisma.user.findFirstOrThrow({
        where: { login: 'admin' },
      });

      await request(app.getHttpServer())
        .get(`/users/${adminInDb.userId}`)
        .expect(401);
    });
  });

  describe('/users/:id (DELETE)', () => {
    it('should return 200 if admin deletes a user', async () => {
      const tokenValue: string = await getAuthToken(
        app.getHttpServer(),
        adminData,
      );

      const userInDb = await prisma.user.findFirstOrThrow({
        where: { login: 'testuser' },
      });

      await request(app.getHttpServer())
        .delete(`/users/${userInDb.userId}`)
        .set('Authorization', `Bearer ${tokenValue}`)
        .expect(200);

      const deletedUser = await prisma.user.findUnique({
        where: { userId: userInDb.userId },
      });

      expect(deletedUser).toBeNull();
    });

    it('should return 403 if non-admin tries to delete a user', async () => {
      const tokenValue: string = await getAuthToken(
        app.getHttpServer(),
        userData,
      );

      const adminInDb = await prisma.user.findFirstOrThrow({
        where: { login: 'admin' },
      });

      await request(app.getHttpServer())
        .delete(`/users/${adminInDb.userId}`)
        .set('Authorization', `Bearer ${tokenValue}`)
        .expect(403);
    });

    it('should return 401 if unauthenticated user tries to delete a user', async () => {
      const adminInDb = await prisma.user.findFirstOrThrow({
        where: { login: 'admin' },
      });

      await request(app.getHttpServer())
        .delete(`/users/${adminInDb.userId}`)
        .expect(401);
    });

    it('should return 200 if user deletes their own account', async () => {
      const tokenValue: string = await getAuthToken(
        app.getHttpServer(),
        userData,
      );

      const userInDb = await prisma.user.findFirstOrThrow({
        where: { login: 'testuser' },
      });

      await request(app.getHttpServer())
        .delete(`/users/${userInDb.userId}`)
        .set('Authorization', `Bearer ${tokenValue}`)
        .expect(200);

      const deletedUser = await prisma.user.findUnique({
        where: { userId: userInDb.userId },
      });

      expect(deletedUser).toBeNull();
    });

    it('should return 403 if user tries to delete another user account', async () => {
      const tokenValue: string = await getAuthToken(
        app.getHttpServer(),
        userData,
      );

      const adminInDb = await prisma.user.findFirstOrThrow({
        where: { login: 'admin' },
      });

      await request(app.getHttpServer())
        .delete(`/users/${adminInDb.userId}`)
        .set('Authorization', `Bearer ${tokenValue}`)
        .expect(403);
    });
  });

  describe('/users/:id (PATCH)', () => {
    it('should return 200 if admin updates a user', async () => {
      const tokenValue: string = await getAuthToken(
        app.getHttpServer(),
        adminData,
      );

      const userInDb = await prisma.user.findFirstOrThrow({
        where: { login: 'testuser' },
      });

      const response = await request(app.getHttpServer())
        .patch(`/users/${userInDb.userId}`)
        .set('Authorization', `Bearer ${tokenValue}`)
        .send({ email: 'user@example.com' })
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          login: 'testuser',
          email: 'user@example.com',
        }),
      );
    });

    it('should return 403 if non-admin tries to update another user', async () => {
      const tokenValue: string = await getAuthToken(
        app.getHttpServer(),
        userData,
      );

      const adminInDb = await prisma.user.findFirstOrThrow({
        where: { login: 'admin' },
      });

      await request(app.getHttpServer())
        .patch(`/users/${adminInDb.userId}`)
        .set('Authorization', `Bearer ${tokenValue}`)
        .send({ email: 'elo@benc.pl' })
        .expect(403);
    });

    it('should return 200 if user updates their own profile', async () => {
      const tokenValue: string = await getAuthToken(
        app.getHttpServer(),
        userData,
      );

      const userInDb = await prisma.user.findFirstOrThrow({
        where: { login: 'testuser' },
      });

      const response = await request(app.getHttpServer())
        .patch(`/users/${userInDb.userId}`)
        .set('Authorization', `Bearer ${tokenValue}`)
        .send({ email: 'sigeimkamaila@com.pl' })
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          login: 'testuser',
          email: 'sigeimkamaila@com.pl',
        }),
      );
    });

    it('should return 401 if unauthenticated user tries to update any profile', async () => {
      const adminInDb = await prisma.user.findFirstOrThrow({
        where: { login: 'admin' },
      });

      await request(app.getHttpServer())
        .patch(`/users/${adminInDb.userId}`)
        .send({ email: 'elo@benc.pl' })
        .expect(401);
    });

    it('should return 400 if data is invalid', async () => {
      const tokenValue: string = await getAuthToken(
        app.getHttpServer(),
        adminData,
      );

      const userInDb = await prisma.user.findFirstOrThrow({
        where: { login: 'testuser' },
      });

      await request(app.getHttpServer())
        .patch(`/users/${userInDb.userId}`)
        .set('Authorization', `Bearer ${tokenValue}`)
        .send({ email: 'invalidemail' })
        .expect(400);
    });
  });
});
