import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  print(str: string): string {
    return `your Input: ${str}`;
  }
}
