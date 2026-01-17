import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    // Default to 'USER' role if none provided
    const rolesToAssign = createUserDto.roles && createUserDto.roles.length > 0 
      ? createUserDto.roles 
      : ['USER'];

    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        name: createUserDto.name,
        roles: {
          connectOrCreate: rolesToAssign.map(role => ({
            where: { name: role },
            create: { name: role },
          })),
        },
      },
      include: { roles: true }, // Return user with roles
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ 
      where: { email },
      include: { roles: true },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { roles, ...data } = updateUserDto;

    return this.prisma.user.update({
      where: { id },
      data: {
        ...data,
        roles: roles ? {
          set: roles.map(role => ({ name: role })),
        } : undefined,
      },
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
