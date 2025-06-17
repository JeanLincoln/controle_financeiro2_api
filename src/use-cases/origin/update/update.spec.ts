import { OriginRepository } from "@domain/repositories/origin.repository";
import { UpdateOriginUseCase } from "./update.use-case";
import { OriginRepositoryStub } from "@test/stubs/repositories/origin";
import {
  CREATE_OR_UPDATE_ORIGIN_MOCK,
  ORIGIN_MOCK
} from "@test/mocks/origin.mock";

describe("UpdateOriginUseCase", () => {
  let sut: UpdateOriginUseCase;
  let originRepository: OriginRepository;

  beforeEach(() => {
    originRepository = new OriginRepositoryStub();
    sut = new UpdateOriginUseCase(originRepository);
  });

  it("should update an origin", async () => {
    jest.spyOn(originRepository, "update");

    const result = await sut.execute(
      ORIGIN_MOCK.id,
      ORIGIN_MOCK.user.id,
      CREATE_OR_UPDATE_ORIGIN_MOCK
    );

    testUtils.resultExpectations(result, undefined);
    testUtils.timesCalledExpectations({
      mockFunction: originRepository.update,
      calledWith: [
        ORIGIN_MOCK.id,
        ORIGIN_MOCK.user.id,
        CREATE_OR_UPDATE_ORIGIN_MOCK
      ],
      times: 1
    });
  });
});
