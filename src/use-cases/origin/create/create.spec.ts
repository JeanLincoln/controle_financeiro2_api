import { OriginRepository } from "@domain/repositories/origin.repository";
import { CreateOriginUseCase } from "./create.use-case";
import { OriginRepositoryStub } from "@test/stubs/repositories/origin";
import { USER_MOCK } from "@test/mocks/user.mock";
import {
  CREATE_OR_UPDATE_ORIGIN_MOCK,
  ORIGIN_MOCK
} from "@test/mocks/origin.mock";

describe("CreateOriginUseCase", () => {
  let sut: CreateOriginUseCase;
  let originRepository: OriginRepository;

  beforeEach(() => {
    originRepository = new OriginRepositoryStub();
    sut = new CreateOriginUseCase(originRepository);
  });

  it("should create an origin", async () => {
    const createOriginSpy = jest.spyOn(originRepository, "create");
    createOriginSpy.mockResolvedValue(ORIGIN_MOCK);

    const result = await sut.execute(
      USER_MOCK.id,
      CREATE_OR_UPDATE_ORIGIN_MOCK
    );

    testUtils.resultExpectations(result, ORIGIN_MOCK);
    testUtils.timesCalledExpectations({
      mockFunction: originRepository.create,
      calledWith: [USER_MOCK.id, CREATE_OR_UPDATE_ORIGIN_MOCK],
      times: 1
    });
  });
});
