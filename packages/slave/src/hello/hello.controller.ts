import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { HelloService } from './hello.service';

@Controller()
export class HelloController {
  constructor(private readonly hello: HelloService) {}

  @MessagePattern({ cmd: 'hello' })
  async sayHello(): Promise<string> {
    return this.hello.sayHello();
  }
}
