import { Controller, Get } from "@nestjs/common";

@Controller("hello-word")
export class HelloWorldController {
  @Get()
  getHello(): string {
    return "Hello World";
  }
}
