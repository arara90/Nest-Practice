import { Controller, Get, HostParam } from "@nestjs/common";

@Controller({ host: ":version.api.localhost" })
export class VersionApiController {
  @Get()
  indexVersion(@HostParam("version") version: string): string {
    return `Hello, API ${version}`;
  }
}
