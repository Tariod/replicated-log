import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, first, merge } from 'rxjs';

import { HELLO_SLAVE } from './hello.constants';

@Injectable()
export class HelloService {
  constructor(@Inject(HELLO_SLAVE) private readonly clients: ClientProxy[]) {}

  sayHello(): Observable<string> {
    const pattern = { cmd: 'hello' };
    return merge(
      ...this.clients.map((client) => client.send<string>(pattern, {})),
    ).pipe(first());
  }
}
