import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma.module';
import { AdminModule } from './admin/admin.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [UsersModule, AuthModule, PrismaModule, AdminModule, MailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
