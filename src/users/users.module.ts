import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './users.schema';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),EmailModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService] // ✅ BUNU EKLE
})
export class UsersModule {}
