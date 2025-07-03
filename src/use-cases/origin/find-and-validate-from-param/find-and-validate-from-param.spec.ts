import { OriginRepository } from "@domain/repositories/origin.repository";
import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { OriginRepositoryStub } from "@test/stubs/repositories/origin";
import { ExceptionsAdapterStub } from "@test/stubs/adapters/exceptions.stub";
import {
  ORIGIN_MOCK,
  ORIGIN_MOCK_2,
  PARAM_ORIGIN_AUTHENTICATED_REQUEST_MOCK
} from "@test/mocks/origin.mock";
import { FindAndValidateOriginFromParamUseCase } from "./find-and-validate-from-param.use-case";

describe("FindAndValidateOriginFromParamUseCase", () => {
  let sut: FindAndValidateOriginFromParamUseCase;
  let originRepository: OriginRepository;
  let exceptionsAdapter: ExceptionsAdapter;

  beforeEach(() => {
    originRepository = new OriginRepositoryStub();
    exceptionsAdapter = new ExceptionsAdapterStub();

    sut = new FindAndValidateOriginFromParamUseCase(
      originRepository,
      exceptionsAdapter
    );

    jest.spyOn(exceptionsAdapter, "notFound");
    jest.spyOn(exceptionsAdapter, "forbidden");
  });

  it("should return true and set the origin in the request if the origin is found", async () => {
    jest.spyOn(originRepository, "findById").mockResolvedValue(ORIGIN_MOCK);

    const result = await sut.execute(PARAM_ORIGIN_AUTHENTICATED_REQUEST_MOCK);

    testUtils.resultExpectations(result, true);
    testUtils.notCalledExpectations([
      exceptionsAdapter.notFound,
      exceptionsAdapter.forbidden
    ]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: originRepository.findById,
      calledWith: [ORIGIN_MOCK.id]
    });
  });

  it("should return false if the category is not found", async () => {
    jest.spyOn(originRepository, "findById").mockResolvedValue(null);

    const result = await sut.execute(PARAM_ORIGIN_AUTHENTICATED_REQUEST_MOCK);

    testUtils.resultExpectations(result, false);
    testUtils.notCalledExpectations([exceptionsAdapter.forbidden]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: originRepository.findById,
      calledWith: [ORIGIN_MOCK.id]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: exceptionsAdapter.notFound,
      calledWith: [{ message: "Origin not found" }]
    });
  });

  it("should return false if the origin is not owned by the user", async () => {
    jest.spyOn(originRepository, "findById").mockResolvedValue(ORIGIN_MOCK_2);

    const result = await sut.execute(PARAM_ORIGIN_AUTHENTICATED_REQUEST_MOCK);

    testUtils.resultExpectations(result, false);
    testUtils.notCalledExpectations([exceptionsAdapter.notFound]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: originRepository.findById,
      calledWith: [ORIGIN_MOCK.id]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: exceptionsAdapter.forbidden,
      calledWith: [{ message: "You are not allowed to access this origin" }]
    });
  });
});
