import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FreezePipe } from './pipes/freeze.pipe';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  // @UseInterceptors(LoggingInterceptor)
  // @UserFilters()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/hi')
  getHi(): string {
    return this.appService.getHello();
  }

  // this route shows how the freezepipe throws an error
  @Post()
  examplePost(@Body(new FreezePipe()) body: any) {
    body.test = 32;
  }

  // this is for showing the use of filters (http-exception.filter.ts)
  @Get('error')
  throwError() {
    throw new InternalServerErrorException();
  }
}
