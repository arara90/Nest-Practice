import { Controller, Get, HostParam } from "@nestjs/common";

@Controller({ host: 'api.localhost' })
export class SubApiController {
  @Get() // 같은 루트 경로
  index(): string {
    return 'Hello, API'; // 다른 응답
  }
}
