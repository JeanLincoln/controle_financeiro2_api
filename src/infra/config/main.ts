import { NestFactory } from "@nestjs/core";
import { AppModule } from "../modules/app/app.module";
import { SwaggerConfig } from "./swagger/swagger.config";
import { ValidationPipe } from "@nestjs/common";
import { LoggingInterceptor } from "@infra/commons/interceptors/logging.interceptor";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  SwaggerConfig.config(app);
  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalInterceptors(new LoggingInterceptor());

  await app.listen(process.env.PORT!);

  console.log(`Server is running on port ${process.env.PORT}`);
}
bootstrap();
