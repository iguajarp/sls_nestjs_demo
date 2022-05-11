import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  /* This works fine if we don't have any dependencies to inject */
  // app.useGlobalGuards(new AuthGuard());
  // app.userGlobalInterceptor(new LoggerInterceptor());
  // app.useGlobalPipes(new FreezePipe());
  // app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}

bootstrap();