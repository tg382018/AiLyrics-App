import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SongsModule } from './songs/songs.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';




@Module({
  imports: [
    ConfigModule.forRoot({
       isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' 
        ? '.env.production'
        : '.env.development',
    }),
    MongooseModule.forRoot(process.env.MONGO_URI || ''),
    SongsModule,
    UsersModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
