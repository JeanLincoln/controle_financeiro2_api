import { CategoryRepository } from "@domain/repositories/category.repository";
import { CategoryRankingUseCase } from "./category-ranking.use-case";
import { CategoryRepositoryStub } from "@test/stubs/repositories/category.stub";
import { USER_MOCK } from "@test/mocks/user.mock";

describe("CategoryRankingUseCase", () => {
  let sut: CategoryRankingUseCase;
  let categoryRepository: CategoryRepository;

  beforeEach(() => {
    categoryRepository = new CategoryRepositoryStub();
    sut = new CategoryRankingUseCase(categoryRepository);
  });

  it("should return category ranking for the current month", async () => {
    jest.spyOn(categoryRepository, "getCurrentMonthCategories");

    await sut.execute(USER_MOCK.id, undefined);

    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: categoryRepository.getCurrentMonthCategories,
      calledWith: [USER_MOCK.id, undefined]
    });
  });
});
