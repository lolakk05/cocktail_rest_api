import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserFilterDto } from '../filters/user-filter.dto';
import { AuthGuard, type RequestWithUser } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { UpdateUserAdminDto } from './dto/update-user-admin.dto';
import { UserEntity } from './entities/user.entity';

@Controller('users')
@ApiTags('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Creates single user',
  })
  @ApiCreatedResponse({
    description: 'User succesfuly created',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed (e.g. missing value, wrong type)',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async create(@Body() createUserDto: CreateUserDto) {
    return new UserEntity(await this.userService.create(createUserDto));
  }

  @Get()
  @ApiOperation({
    summary: 'Get all the users',
    description: 'Returns all the users',
  })
  @ApiOkResponse({
    description: 'Users succesfully found',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async findAll(@Query() filterDto: UserFilterDto) {
    const users = await this.userService.findAll(filterDto);
    return users.map((user) => new UserEntity(user));
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get one user with specified id',
    description: 'Get user with id specified in path',
  })
  @ApiOkResponse({
    description: 'User succesfully found',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(+id);
    if (!user) throw new NotFoundException('User not found');
    return new UserEntity(user);
  }

  @ApiOperation({ summary: 'Update own profile' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch('me')
  async updateMe(
    @Req() req: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return new UserEntity(
      await this.userService.update(req.user.id, updateUserDto),
    );
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update data of user',
    description: 'Update data of user specified in path',
  })
  @ApiOkResponse({
    description: 'User succesfully updated',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed (e.g. wrong type)',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserAdminDto,
  ) {
    return new UserEntity(await this.userService.update(+id, updateUserDto));
  }

  @ApiOperation({ summary: 'Delete own profile' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete('me')
  async removeMe(@Req() req: RequestWithUser) {
    return new UserEntity(await this.userService.remove(req.user.id));
  }

  @ApiOperation({
    summary: 'Delete one user',
    description: 'Delete data of user specified in path',
  })
  @ApiOkResponse({
    description: 'User succesfully deleted',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed (e.g. wrong type)',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return new UserEntity(await this.userService.remove(+id));
  }
}
