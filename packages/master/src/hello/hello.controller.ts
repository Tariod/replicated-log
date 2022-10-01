import { Controller, Get } from '@nestjs/common';
import { Observable } from 'rxjs';

import { HelloService } from './hello.service';

@Controller()
export class HelloController {
  constructor(private readonly appService: HelloService) {}

  @Get()
  sayHello(): Observable<string> {
    return this.appService.sayHello();
  }
}
