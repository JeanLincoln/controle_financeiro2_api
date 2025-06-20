import { Category } from "@domain/entities/category.entity";
import {
  Injectable,
  CallHandler,
  ExecutionContext,
  NestInterceptor
} from "@nestjs/common";
import { map, Observable } from "rxjs";

type CategoryResponse = Omit<Category, "user" | "transactions">;

@Injectable()
export class FindByIdCategoryInterceptor implements NestInterceptor {
  intercept(
    _: ExecutionContext,
    next: CallHandler
  ): Observable<CategoryResponse> {
    return next.handle().pipe(
      map((data) => ({
        id: data.id,
        name: data.name,
        description: data.description,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        type: data.type,
        color: data.color,
        icon: data.icon,
        subCategories: data.subCategories
      }))
    );
  }
}
