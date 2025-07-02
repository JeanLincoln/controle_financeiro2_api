import { Origin } from "@domain/entities/origin.entity";
import { CreateOrUpdateAllOriginProps } from "@domain/repositories/origin.repository";
import { OriginAuthenticatedRequest } from "@use-cases/origin/find-and-validate-from-param/find-and-validate-from-param.use-case";
import { USER_MOCK, USER_MOCK_2 } from "./user.mock";
import { OriginBodyAuthenticatedRequest } from "@use-cases/origin/find-and-validate-from-body/find-and-validate-from-body.use-case";

export const CREATE_OR_UPDATE_ORIGIN_MOCK: CreateOrUpdateAllOriginProps = {
  name: "Origin",
  description: "Origin description",
  color: "#FF0000",
  icon: "test-icon"
};

export const ORIGINS_MOCK: Origin[] = Array.from(
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

export const ORIGIN_MOCK: Origin = ORIGINS_MOCK[0];

export const ORIGIN_MOCK_2: Origin = ORIGINS_MOCK[1];

export const PARAM_ORIGIN_AUTHENTICATED_REQUEST_MOCK = {
  user: USER_MOCK,
  params: {
    originId: "1"
  }
} as OriginAuthenticatedRequest;

export const BODY_ORIGIN_AUTHENTICATED_REQUEST_MOCK = {
  user: USER_MOCK,
  body: { originId: 1 }
} as OriginBodyAuthenticatedRequest;
