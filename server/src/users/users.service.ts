import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(userid: string) {
    console.log(userid);
    return await this.prisma.user.findUnique({ where: { userid } });
  }

  async create(userid: string, password: string) {
    return await this.prisma.user.create({ data: { userid, password } });
  }
}
