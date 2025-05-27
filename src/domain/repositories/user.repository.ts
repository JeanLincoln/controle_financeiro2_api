import { User } from "../entities/user.entity";

export type CreateOrUpdatePutUserProps = Omit<
  User,
  "id" | "createdAt" | "updatedAt"
>;

export abstract class UserRepository {
  abstract findAll(): Promise<User[]>;
  abstract findById(id: number): Promise<User>;
  abstract create(user: CreateOrUpdatePutUserProps): Promise<User>;
  abstract update(id: number, user: CreateOrUpdatePutUserProps): Promise<User>;
  abstract delete(id: number): Promise<void>;
}
