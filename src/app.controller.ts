import { Controller, Get, Req, Header, Param, Redirect, Delete } from "@nestjs/common";
import { AppService } from "./app.service";
import { Request } from "express";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }


  @Get("req")
  getRequest(@Req() req: Request): string {
    console.log(req);
    return this.appService.getHello();
  }

  @Header('Custom', 'Test Header')
  @Get(':id')
  findOneWithHeader(@Param('id') id: string) {

    return this.appService.print(`${id}`);
  }

  @Redirect('https://nestjs.com', 301)
  @Get('/redirect/:id')
  redirect(@Param('id') id: string) {
    return this.appService.print(`${id}`);
  }

  @Delete(':userId/memo/:memoId')
  deleteUserMemo(@Param() params: { [key: string]: string }) {
    return `userId: ${params.userId}, memoId: ${params.memoId}`;
  }
}
