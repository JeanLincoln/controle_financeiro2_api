import { OriginRepository } from "@domain/repositories/origin.repository";
import { FindAllOriginUseCase } from "./find-all.use-case";
import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { OriginRepositoryStub } from "@test/stubs/repositories/origin";
import { ExceptionsAdapterStub } from "@test/stubs/adapters/exceptions.stub";
import { USER_MOCK } from "@test/mocks/user.mock";
import { ORIGIN_MOCK, ORIGINS_MOCK } from "@test/mocks/origin.mock";

describe("FindAllOriginUseCase", () => {
  let sut: FindAllOriginUseCase;
  let originRepository: OriginRepository;
  let exceptionsAdapter: ExceptionsAdapter;

  beforeEach(() => {
    originRepository = new OriginRepositoryStub();
    exceptionsAdapter = new ExceptionsAdapterStub();
    sut = new FindAllOriginUseCase(originRepository, exceptionsAdapter);

    jest.spyOn(exceptionsAdapter, "internalServerError");
    jest.spyOn(exceptionsAdapter, "forbidden");
  });

  it("should return all users origins", async () => {
    jest.spyOn(originRepository, "findAll").mockResolvedValue([ORIGIN_MOCK]);

    const result = await sut.execute(USER_MOCK.id);

    testUtils.resultExpectations(result, [ORIGIN_MOCK]);
    testUtils.notCalledExpectations([
      exceptionsAdapter.internalServerError,
      exceptionsAdapter.forbidden
    ]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: originRepository.findAll,
      calledWith: [USER_MOCK.id]
    });
  });

  it("should return an empty array if the user has no origins", async () => {
    jest.spyOn(originRepository, "findAll").mockResolvedValue([]);

    const result = await sut.execute(USER_MOCK.id);

    testUtils.resultExpectations(result, []);
    testUtils.notCalledExpectations([
      exceptionsAdapter.internalServerError,
      exceptionsAdapter.forbidden
    ]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: originRepository.findAll,
      calledWith: [USER_MOCK.id]
    });
  });

  it("should throw an error if there is at least one origin that doesn't belong to the user", async () => {
    jest.spyOn(originRepository, "findAll").mockResolvedValue(ORIGINS_MOCK);

    const result = await sut.execute(USER_MOCK.id);

    testUtils.resultExpectations(result, undefined);
    testUtils.notCalledExpectations([exceptionsAdapter.internalServerError]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: originRepository.findAll,
      calledWith: [USER_MOCK.id]
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
