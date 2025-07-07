import { User } from "../entities/user.entity";

export type UserWithoutRelations = Omit<
  User,
  "transactions" | "origins" | "categories"
>;

export type BaseCreateOrUpdateUserProps = Omit<
  UserWithoutRelations,
  "id" | "createdAt" | "updatedAt"
>;

export type UpdateUserProps = BaseCreateOrUpdateUserProps & {
  password?: string;
};

export type UserWithoutPassword = Omit<UserWithoutRelations, "password">;

export type UserWithAllPropsParams =
  | { id: number; email?: string }
  | { id?: number; email: string };

export abstract class UserRepository {
  abstract findAll(): Promise<User[]>;
  abstract findById(id: number): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findUserWithAllProps(
    params: UserWithAllPropsParams
  ): Promise<User | null>;
  abstract create(user: BaseCreateOrUpdateUserProps): Promise<void>;
  abstract update(id: number, user: UpdateUserProps): Promise<void>;
  abstract delete(id: number): Promise<void>;
}
