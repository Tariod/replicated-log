import { Module } from '@nestjs/common';

import { RepLogModule } from './rep-log';

@Module({
  imports: [RepLogModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
