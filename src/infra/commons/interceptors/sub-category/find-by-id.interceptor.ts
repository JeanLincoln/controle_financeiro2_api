import { SubCategory } from "@domain/entities/sub-category.entity";
import {
  Injectable,
  CallHandler,
  ExecutionContext,
  NestInterceptor
} from "@nestjs/common";
import { map, Observable } from "rxjs";

type SubCategoryResponse = Omit<SubCategory, "user" | "transactions">;

@Injectable()
export class FindByIdSubCategoryInterceptor implements NestInterceptor {
  intercept(
    _: ExecutionContext,
    next: CallHandler
  ): Observable<SubCategoryResponse> {
    return next.handle().pipe(
      map((data) => ({
        id: data.id,
        name: data.name,
        description: data.description,
        color: data.color,
        icon: data.icon,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        transactions: data.transactions,
        categoryId: data.category.id,
        category: { ...data.category, user: undefined }
      }))
    );
  }
}
