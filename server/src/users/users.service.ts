import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(userid: string) {
    return await this.prisma.user.findUnique({ where: { userid } });
  }

  async create(userid: string, password: string) {
    return await this.prisma.user.create({ data: { userid, password } });
  }

  async updateFCMToken(userid: string, fcmToken: string) {
    return await this.prisma.user.update({
      where: { userid },
      data: { fcmToken },
    });
  }
}
