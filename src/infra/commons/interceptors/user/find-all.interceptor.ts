import { UserWithoutPassword } from "@domain/repositories/user.repository";
import {
  Injectable,
  CallHandler,
  ExecutionContext,
  NestInterceptor
} from "@nestjs/common";
import { map, Observable } from "rxjs";

@Injectable()
export class FindAllUserInterceptor implements NestInterceptor {
  intercept(
    _: ExecutionContext,
    next: CallHandler
  ): Observable<UserWithoutPassword[]> {
    return next.handle().pipe(
      map((data: UserWithoutPassword[]) =>
        data.map((user) => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          birthDate: user.birthDate,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }))
      )
    );
  }
}
