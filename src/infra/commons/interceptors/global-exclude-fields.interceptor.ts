import {
  Injectable,
  CallHandler,
  ExecutionContext,
  NestInterceptor
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { map, Observable } from "rxjs";
import { FIELDS_KEY } from "@infra/commons/decorators/fields-to-exclude.decorator";

@Injectable()
export class GlobalExcludeFieldsInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const specificFields = this.reflector.getAllAndOverride<string[]>(
      FIELDS_KEY,
      [context.getHandler(), context.getClass()]
    );

    return next
      .handle()
      .pipe(map((data) => this.excludeFields(data, specificFields)));
  }

  private excludeFields(data: unknown, specificFields?: string[]): unknown {
    if (!data || typeof data !== "object") return data;

    if (Array.isArray(data)) {
      return data.map((item) => this.excludeFields(item, specificFields));
    }

    const result = Object.entries(data).reduce(
      (acc, [key, value]) => {
        const valueIsAnObject = typeof value === "object";
        const isDate = value instanceof Date;
        const globalFieldsToExclude = ["password"];
        const keyIsListed = specificFields && specificFields.includes(key);
        const globalKeyIsListed = globalFieldsToExclude.includes(key);

        if (keyIsListed || globalKeyIsListed) {
          return acc;
        }

        if (!keyIsListed && !globalKeyIsListed && valueIsAnObject && !isDate) {
          acc[key] = this.excludeFields(value, specificFields);
          return acc;
        }

        if (!keyIsListed && !globalKeyIsListed && valueIsAnObject && isDate) {
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
