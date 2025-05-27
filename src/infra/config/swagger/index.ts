import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export class SwaggerConfig {
  static config(app: INestApplication) {
    const config = new DocumentBuilder()
      .setTitle("Controle Financeiro 2")
      .setDescription("Um app para gerenciar suas finanças")
      .setVersion("0.0.1")
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, documentFactory);
  }
}
