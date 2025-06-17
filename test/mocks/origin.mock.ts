import { Origin } from "@domain/entities/origin.entity";
import { USER_MOCK, USER_MOCK_2 } from "./user.mock";
import { CreateOrUpdateAllOriginProps } from "@domain/repositories/origin.repository";
import { OriginAuthenticatedRequest } from "@use-cases/origin/find-and-validate.use-case/find-and-validate.use-case";

export const CREATE_OR_UPDATE_ORIGIN_MOCK: CreateOrUpdateAllOriginProps = {
  name: "Origin",
  description: "Origin description",
  color: "#FF0000",
  icon: "test-icon",
  userId: 1
};

export const CATEGORIES_MOCK: Origin[] = Array.from(
  { length: 10 },
  (_, index) => ({
    id: index + 1,
    name: `Origin ${index + 1}`,
    description: `Origin ${index + 1} description`,
    color: "#FF0000",
    icon: "test-icon",
    userId: (index + 1) % 2 === 0 ? 2 : 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    transactions: [],
    user: (index + 1) % 2 === 0 ? USER_MOCK_2 : USER_MOCK
  })
);

export const ORIGIN_MOCK: Origin = CATEGORIES_MOCK[0];

export const ORIGIN_MOCK_2: Origin = CATEGORIES_MOCK[1];

export const ORIGIN_AUTHENTICATED_REQUEST_MOCK = {
  user: USER_MOCK,
  params: {
    id: "1"
  }
} as OriginAuthenticatedRequest;
