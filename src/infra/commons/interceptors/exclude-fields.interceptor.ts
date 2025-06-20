import { FIELDS_KEY } from "@infra/commons/decorators/fields-to-exclude.decorator";
import {
  Injectable,
  CallHandler,
  ExecutionContext,
  NestInterceptor
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { map, Observable } from "rxjs";

@Injectable()
export class ExcludeFieldsInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const fieldsToExclude = this.reflector.getAllAndOverride<string[]>(
      FIELDS_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!fieldsToExclude) {
      return next.handle();
    }

    return next
      .handle()
      .pipe(map((data) => this.excludeFields(data, fieldsToExclude)));
  }

  private excludeFields(data: unknown, fields: string[]): unknown {
    if (!data || typeof data !== "object") return data;

    const result = Object.entries(data).reduce(
      (acc, [key, value]) => {
        const valueIsAnObject = typeof value === "object";
        const keyIsListed = fields.includes(key);
        const isDate = value instanceof Date;

        if (keyIsListed) {
          return acc;
        }

        if (valueIsAnObject && !keyIsListed && !isDate) {
          acc[key] = this.excludeFields(value, fields);
          return acc;
        }

        if (valueIsAnObject && !keyIsListed && isDate) {
          acc[key] = value.toISOString();
          return acc;
        }

        acc[key] = value;
        return acc;
      },
      {} as Record<string, unknown>
    );
    return result;
  }
}
