import { User } from "../../src/domain/entities/user.entity";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import * as bcrypt from "bcrypt";

export class UserSeed1750016564337 implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(User);
    const salt = await bcrypt.genSalt();

    const user = repository.create({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: await bcrypt.hash("Password123!", salt),
      birthDate: "1990-01-01T00:00:00.000Z"
    });

    await repository.save(user);
  }
}
