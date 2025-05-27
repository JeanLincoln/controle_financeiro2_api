import { Module } from "@nestjs/common";
import { TypeOrmUserRepository } from "../../repositories/user";
import { UserRepository } from "@domain/repositories/user.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@domain/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    {
      useClass: TypeOrmUserRepository,
      provide: UserRepository
    }
  ],
  exports: [UserRepository]
})
export class DatabaseModule {}
