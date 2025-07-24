import { SubCategoryRepository } from "@domain/repositories/sub-category.repository";
import { USER_MOCK } from "@test/mocks/user.mock";
import { SubCategoryRepositoryStub } from "@test/stubs/repositories/sub-category.stub";
import { SubCategoryRankingUseCase } from "./sub-category-ranking.use-case";

describe("SubCategoryRankingUseCase", () => {
  let sut: SubCategoryRankingUseCase;
  let subCategoryRepository: SubCategoryRepository;

  beforeEach(() => {
    subCategoryRepository = new SubCategoryRepositoryStub();
    sut = new SubCategoryRankingUseCase(subCategoryRepository);
  });

  it("should return subCategory ranking for the current month", async () => {
    jest.spyOn(subCategoryRepository, "getCurrentMonthTopFiveCategories");

    await sut.execute(USER_MOCK.id);

    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: subCategoryRepository.getCurrentMonthTopFiveCategories,
      calledWith: [USER_MOCK.id, undefined]
    });
  });
});
