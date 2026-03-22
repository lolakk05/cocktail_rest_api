import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from '../database/database.service';
import { DEFAULT_PAGE_SIZE } from '../pagination/utils/constants';
import { UserFilterDto } from '../filters/user-filter.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private database: DatabaseService) {}

  async create(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    return this.database.user.create({
      data: {
        password: hashedPassword,
        login: createUserDto.login,
        email: createUserDto.email,
      },
    });
  }

  findAll(filters: UserFilterDto) {
    const { page = 1, limit = DEFAULT_PAGE_SIZE } = filters;
    return this.database.user.findMany({
      skip: (page - 1) * limit,
      take: filters.limit ?? DEFAULT_PAGE_SIZE,
      where: {
        ...(filters.login && {
          login: { contains: filters.login, mode: 'insensitive' },
        }),
        ...(filters.email && {
          email: { contains: filters.email, mode: 'insensitive' },
        }),
      },
    });
  }

  findOne(id: number) {
    return this.database.user.findUnique({
      where: {
        userId: id,
      },
    });
  }

  findOneByLogin(login: string) {
    return this.database.user.findUnique({
      where: {
        login: login,
      },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.database.user.update({
      where: {
        userId: id,
      },
      data: {
        ...updateUserDto,
      },
    });
  }

  remove(id: number) {
    return this.database.user.delete({
      where: {
        userId: id,
      },
    });
  }
}
