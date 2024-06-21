import { Logger, Module } from '@nestjs/common';
import { SquooshService } from './squoosh.service';
import { SquooshController } from './squoosh.controller';
import { SquooshRepository } from './squoosh.repository';

@Module({
  controllers: [SquooshController],
  providers: [SquooshService, SquooshRepository, Logger],
})
export class SquooshModule {}
