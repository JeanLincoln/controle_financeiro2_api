import {
  Injectable,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  Logger
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const startTime = Date.now();

    this.logger.log(`${method} ${url} - Request started`);

    return next.handle().pipe(
      tap({
        next: (_data) => {
          const endTime = Date.now();
          const duration = endTime - startTime;
          this.logger.log(
            `${method} ${url} - Request completed in ${duration}ms`
          );
        },
        error: (error) => {
          const endTime = Date.now();
          const duration = endTime - startTime;
          this.logger.error(
            `${method} ${url} - Request failed in ${duration}ms: ${error.message}`
          );
        }
      })
    );
  }
}
