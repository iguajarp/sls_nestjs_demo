import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';
import { RequestService } from 'src/request.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  constructor(private readonly requestService: RequestService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const userAgent = request.headers['user-agent'] || ''; // client name?
    const { ip, method, url } = request;

    this.logger.log(`
      ${method} ${url} ${userAgent} ${ip}: ${context.getClass().name} ${
      context.getHandler().name
    } invoked...
    `);

    this.logger.debug('userId', this.requestService.getUserId());

    const now = Date.now();
    return next.handle().pipe(
      // pipe the response from the handler
      tap((res) => {
        const response = context.switchToHttp().getResponse<Response>();

        const { statusCode } = response;
        const contentLength = response.getHeader('content-length');

        this.logger.log(`
        ${method} ${url} ${statusCode} ${contentLength} - ${userAgent} ${ip}: ${
          Date.now() - now
        }ms
        `);

        this.logger.debug('Response:', res);
      }),
    );
  }
}
