import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UserService {
  constructor(private database: DatabaseService) {}

  create(createUserDto: CreateUserDto) {
    return this.database.user.create({
      data: {
        ...createUserDto,
      },
    });
  }

  findAll() {
    return this.database.user.findMany();
  }

  findOne(id: number) {
    return this.database.user.findUnique({
      where: {
        userId: id,
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
