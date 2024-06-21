import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SquooshModule } from './squoosh/squoosh.module';
import 'reflect-metadata';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    SquooshModule,
  ],
})
export class AppModule {}
