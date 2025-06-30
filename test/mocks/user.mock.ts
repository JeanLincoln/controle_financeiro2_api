import { User } from "@domain/entities/user.entity";
import { BaseCreateOrUpdateUserProps } from "@domain/repositories/user.repository";

export const CREATE_OR_UPDATE_USER_PARAMS_MOCK: BaseCreateOrUpdateUserProps = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  password: "123456",
  birthDate: new Date()
};

export const USERS_MOCK: User[] = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  firstName: `Test ${index + 1}`,
  lastName: `User ${index + 1}`,
  email: `test${index + 1}@test.com`,
  birthDate: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  password: "123456",
  transactions: [],
  origins: [],
  categories: []
}));

export const USER_MOCK: User = USERS_MOCK[0];

export const USER_MOCK_2: User = USERS_MOCK[1];
