import type { Origin } from "@domain/entities/origin.entity";
import { CreateOrUpdateAllOriginProps } from "@domain/repositories/origin.repository";
import { OriginAuthenticatedRequest } from "@use-cases/origin/find-and-validate/find-and-validate.use-case";
import { USER_MOCK, USER_MOCK_2 } from "./user.mock";

export const CREATE_OR_UPDATE_ORIGIN_MOCK: CreateOrUpdateAllOriginProps = {
  name: "Origin",
  description: "Origin description",
  color: "#FF0000",
  icon: "test-icon"
};

export const CATEGORIES_MOCK: Origin[] = Array.from(
  { length: 10 },
  (_, index) => ({
    id: index + 1,
    name: `Origin ${index + 1}`,
    description: `Origin ${index + 1} description`,
    color: "#FF0000",
    icon: "test-icon",
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
    originId: "1"
  }
} as OriginAuthenticatedRequest;
