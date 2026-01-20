import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma.module';
import { AdminModule } from './admin/admin.module';
import { MailModule } from './mail/mail.module';
import { NewsModule } from './news/news.module';
import { SettingsModule } from './settings/settings.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    PrismaModule,
    AdminModule,
    MailModule,
    NewsModule,
    SettingsModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'), // Serve files from project root public folder
      serveRoot: '/',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
