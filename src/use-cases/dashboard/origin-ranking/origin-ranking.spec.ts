import { OriginRepository } from "@domain/repositories/origin.repository";
import { OriginRankingUseCase } from "./origin-ranking.use-case";
import { USER_MOCK } from "@test/mocks/user.mock";
import { OriginRepositoryStub } from "@test/stubs/repositories/origin";

describe("OriginRankingUseCase", () => {
  let sut: OriginRankingUseCase;
  let originRepository: OriginRepository;

  beforeEach(() => {
    originRepository = new OriginRepositoryStub();
    sut = new OriginRankingUseCase(originRepository);
  });

  it("should return origin ranking for the current month", async () => {
    jest.spyOn(originRepository, "getCurrentMonthTopFiveOrigins");

    await sut.execute(USER_MOCK.id, undefined);

    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: originRepository.getCurrentMonthTopFiveOrigins,
      calledWith: [USER_MOCK.id, undefined]
    });
  });
});
