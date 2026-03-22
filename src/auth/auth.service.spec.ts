import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { DatabaseService } from '../database/database.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
  genSalt: jest.fn().mockResolvedValue('fake-salt'),
}));

describe('AuthService', () => {
  let service: AuthService;

  const mockDBService = {
    user: {
      create: jest.fn().mockImplementation(({ data }) => {
        return Promise.resolve({
          userId: Date.now(),
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }),
      findUnique: jest.fn(),
    },
  };

  const mockUserService = {
    findOneByLogin: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: DatabaseService,
          useValue: mockDBService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a new user', async () => {
    const user = {
      email: 'test@example.com',
      login: 'testuser',
      password: '12367884141',
    };

    const result = await service.register(user);

    expect(result).toEqual(
      expect.objectContaining({
        userId: expect.any(Number),
        email: user.email,
        login: user.login,
      }),
    );

    expect(mockDBService.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        email: user.email,
        login: user.login,
      }),
    });
  });

  it('should return an access token on successful sign in', async () => {
    const loginDto = { login: 'testuser', password: 'password123' };
    const user = {
      userId: 1,
      login: 'testuser',
      password: 'hashedPassword',
    };
    const mockToken = 'secret-token';
    mockUserService.findOneByLogin.mockResolvedValue(user);
    mockDBService.user.findUnique.mockResolvedValue(user);
    mockJwtService.signAsync.mockReturnValue(mockToken);

    const result = await service.signIn(loginDto.login, loginDto.password);

    expect(result).toEqual({ access_token: mockToken });
    expect(mockDBService.user.findUnique).toHaveBeenCalledWith({
      where: {
        login: loginDto.login,
      },
    });
  });
});
