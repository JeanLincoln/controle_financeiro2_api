import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { ExceptionsAdapterStub } from "@test/stubs/adapters/exceptions.stub";
import { OriginRepository } from "@domain/repositories/origin.repository";
import {
  BODY_PARAM_ORIGIN_AUTHENTICATED_REQUEST_MOCK,
  PARAM_ORIGIN_AUTHENTICATED_REQUEST_MOCK,
  QUERY_ORIGIN_AUTHENTICATED_REQUEST_MOCK,
  USER_1_ORIGINS_MOCK,
  USER_2_ORIGINS_MOCK
} from "@test/mocks/origin.mock";
import { FindAndValidateOriginUseCase } from "./find-and-validate.use-case";
import { USER_MOCK } from "@test/mocks/user.mock";
import { OriginRepositoryStub } from "@test/stubs/repositories/origin";

describe("FindAndValidateOriginUseCase", () => {
  let sut: FindAndValidateOriginUseCase;
  let originRepository: OriginRepository;
  let exceptionsAdapter: ExceptionsAdapter;

  beforeEach(() => {
    originRepository = new OriginRepositoryStub();
    exceptionsAdapter = new ExceptionsAdapterStub();
    sut = new FindAndValidateOriginUseCase(originRepository, exceptionsAdapter);

    jest.spyOn(exceptionsAdapter, "notFound");
    jest.spyOn(exceptionsAdapter, "forbidden");
    jest.spyOn(sut, "isParamOriginRequest");
    jest.spyOn(sut, "isQueryOriginRequest");
    jest.spyOn(sut, "isBodyOriginRequest");
    jest.spyOn(sut, "handleParamOriginRequest");
    jest.spyOn(sut, "handleQueryOriginRequest");
    jest.spyOn(sut, "handleBodyOriginRequest");
    jest.spyOn(sut, "validateRequest");
  });

  it("should call handleParamOriginRequest if the originId was passed as a param", async () => {
    jest
      .spyOn(originRepository, "findById")
      .mockResolvedValue(USER_1_ORIGINS_MOCK[0]);

    const response = await sut.execute(PARAM_ORIGIN_AUTHENTICATED_REQUEST_MOCK);

    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.isParamOriginRequest,
      calledWith: [PARAM_ORIGIN_AUTHENTICATED_REQUEST_MOCK]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.handleParamOriginRequest,
      calledWith: [USER_MOCK.id, PARAM_ORIGIN_AUTHENTICATED_REQUEST_MOCK]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.validateRequest,
      calledWith: [USER_MOCK.id, 1]
    });
    testUtils.resultExpectations(response, true);
  });

  it("should call handleQueryOriginRequest if the originId was passed as a query", async () => {
    jest
      .spyOn(originRepository, "findById")
      .mockResolvedValue(USER_1_ORIGINS_MOCK[0]);

    const response = await sut.execute(QUERY_ORIGIN_AUTHENTICATED_REQUEST_MOCK);

    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.isQueryOriginRequest,
      calledWith: [QUERY_ORIGIN_AUTHENTICATED_REQUEST_MOCK]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.handleQueryOriginRequest,
      calledWith: [USER_MOCK.id, QUERY_ORIGIN_AUTHENTICATED_REQUEST_MOCK]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.validateRequest,
      calledWith: [USER_MOCK.id, USER_1_ORIGINS_MOCK[0].id]
    });
    testUtils.resultExpectations(response, true);
  });

  it("should call handleBodyOriginRequest if the originId was passed in the body", async () => {
    jest
      .spyOn(originRepository, "findById")
      .mockResolvedValue(USER_1_ORIGINS_MOCK[0]);

    const response = await sut.execute(
      BODY_PARAM_ORIGIN_AUTHENTICATED_REQUEST_MOCK
    );

    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.isBodyOriginRequest,
      calledWith: [BODY_PARAM_ORIGIN_AUTHENTICATED_REQUEST_MOCK]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.handleBodyOriginRequest,
      calledWith: [USER_MOCK.id, BODY_PARAM_ORIGIN_AUTHENTICATED_REQUEST_MOCK]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: sut.validateRequest,
      calledWith: [USER_MOCK.id, USER_1_ORIGINS_MOCK[0].id]
    });
    testUtils.resultExpectations(response, true);
  });

  it("should return true if all origin are found and belong to the user", async () => {
    jest
      .spyOn(originRepository, "findById")
      .mockResolvedValue(USER_1_ORIGINS_MOCK[0]);

    const result = await sut.execute(
      BODY_PARAM_ORIGIN_AUTHENTICATED_REQUEST_MOCK
    );

    testUtils.resultExpectations(result, true);
    testUtils.resultExpectations(
      BODY_PARAM_ORIGIN_AUTHENTICATED_REQUEST_MOCK.origin,
      USER_1_ORIGINS_MOCK[0]
    );
    testUtils.notCalledExpectations([
      exceptionsAdapter.notFound,
      exceptionsAdapter.forbidden
    ]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: originRepository.findById,
      calledWith: [BODY_PARAM_ORIGIN_AUTHENTICATED_REQUEST_MOCK.body.originId]
    });
  });

  it("should return false if the origin is not found", async () => {
    jest.spyOn(originRepository, "findById").mockResolvedValue(null);

    const result = await sut.execute(
      BODY_PARAM_ORIGIN_AUTHENTICATED_REQUEST_MOCK
    );

    testUtils.resultExpectations(result, false);
    testUtils.notCalledExpectations([exceptionsAdapter.forbidden]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: originRepository.findById,
      calledWith: [BODY_PARAM_ORIGIN_AUTHENTICATED_REQUEST_MOCK.body.originId]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: exceptionsAdapter.notFound,
      calledWith: [{ message: "This origin was not found, please try again" }]
    });
  });

  it("should return false if some origin do not belong to the user", async () => {
    jest
      .spyOn(originRepository, "findById")
      .mockResolvedValue(USER_2_ORIGINS_MOCK[0]);

    const result = await sut.execute(
      BODY_PARAM_ORIGIN_AUTHENTICATED_REQUEST_MOCK
    );

    testUtils.resultExpectations(result, false);
    testUtils.notCalledExpectations([exceptionsAdapter.notFound]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: originRepository.findById,
      calledWith: [BODY_PARAM_ORIGIN_AUTHENTICATED_REQUEST_MOCK.body.originId]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: exceptionsAdapter.forbidden,
      calledWith: [
        {
          message: "You are not allowed to access this origin"
        }
      ]
    });
  });
});
