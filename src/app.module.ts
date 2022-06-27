import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SubApiController } from './sub-api/sub-api.controller';
import { VersionApiController } from './version-api/version-api.controller';

@Module({
  imports: [],
  controllers: [VersionApiController, SubApiController, AppController],
  providers: [AppService],
})
export class AppModule {}
