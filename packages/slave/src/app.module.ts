import { Module } from '@nestjs/common';

import { HelloModule } from './hello';

@Module({
  imports: [HelloModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
