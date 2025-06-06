import { NestFactory } from "@nestjs/core";
import { AppModule } from "../modules/app/app.module";
import { SwaggerConfig } from "./swagger/swagger.config";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  SwaggerConfig.config(app);
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT!);

  console.log(`Server is running on port ${process.env.PORT}`);
}
bootstrap();
