import { UserWithoutPassword } from "@domain/repositories/user.repository";

export type UserWithoutRelations = UserWithoutPassword;

export const USER_WITHOUT_PASSWORD_SELECT: Record<
  keyof UserWithoutRelations,
  boolean
> = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  birthDate: true,
  createdAt: true,
  updatedAt: true
};

export const USER_WITHOUT_PASSWORD_SELECT_STRING = [
  "user.id",
  "user.firstName",
  "user.lastName",
  "user.email",
  "user.birthDate",
  "user.createdAt",
  "user.updatedAt"
];
