import { Controller, Get, ServiceUnavailableException } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { DataSource } from "typeorm";

@ApiTags("Health")
@Controller("health")
export class HealthController {
  constructor(private readonly dataSource: DataSource) {}

  @Get()
  async check() {
    try {
      await this.dataSource.query("SELECT 1");

      return {
        status: "ok"
      };
    } catch {
      throw new ServiceUnavailableException({
        status: "error"
      });
    }
  }
}
