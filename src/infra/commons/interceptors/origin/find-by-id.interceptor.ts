import { Origin } from "@domain/entities/origin.entity";
import {
  Injectable,
  CallHandler,
  ExecutionContext,
  NestInterceptor
} from "@nestjs/common";
import { map, Observable } from "rxjs";

type OriginResponse = Omit<Origin, "user" | "transactions">;

@Injectable()
export class FindByIdOriginInterceptor implements NestInterceptor {
  intercept(
    _: ExecutionContext,
    next: CallHandler
  ): Observable<OriginResponse> {
    return next.handle().pipe(
      map((data) => ({
        ...data,
        user: undefined
      }))
    );
  }
}
