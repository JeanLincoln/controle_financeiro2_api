import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "../modules/app/app.module";
import { SwaggerConfig } from "./swagger/swagger.config";
import { ValidationPipe } from "@nestjs/common";
import { LoggingInterceptor } from "@infra/commons/interceptors/logging.interceptor";
import { GlobalExcludeFieldsInterceptor } from "@infra/commons/interceptors/global-exclude-fields.interceptor";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  SwaggerConfig.config(app);
  app.useGlobalPipes(new ValidationPipe());

  const reflector = app.get(Reflector);

  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new GlobalExcludeFieldsInterceptor(reflector)
  );

  await app.listen(process.env.PORT!);

  console.log(`Server is running on port ${process.env.PORT}`);
}
bootstrap();
