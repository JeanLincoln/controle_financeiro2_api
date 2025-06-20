import type { UserWithoutPassword } from "@domain/repositories/user.repository";
import {
  Injectable,
  type CallHandler,
  type ExecutionContext,
  type NestInterceptor
} from "@nestjs/common";
import { map, type Observable } from "rxjs";

@Injectable()
export class FindByIdUserInterceptor implements NestInterceptor {
  intercept(
    _: ExecutionContext,
    next: CallHandler
  ): Observable<UserWithoutPassword> {
    return next.handle().pipe(
      map((data: UserWithoutPassword) => ({
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        birthDate: data.birthDate,
        email: data.email,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      }))
    );
  }
}
