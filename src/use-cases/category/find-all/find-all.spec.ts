import { CategoryRepository } from "@domain/repositories/category.repository";
import { FindAllCategoryUseCase } from "./find-all.use-case";
import { CategoryRepositoryStub } from "@test/stubs/repositories/category.stub";
import { CATEGORIES_MOCK } from "@test/mocks/category.mock";

describe("FindAllCategoryUseCase", () => {
  let sut: FindAllCategoryUseCase;
  let categoryRepository: CategoryRepository;

  beforeEach(() => {
    categoryRepository = new CategoryRepositoryStub();
    sut = new FindAllCategoryUseCase(categoryRepository);
  });

  it("should be able to find all categories by user id", async () => {
    jest
      .spyOn(categoryRepository, "findAll")
      .mockResolvedValue(CATEGORIES_MOCK);

    const categories = await sut.execute(1);

    testUtils.resultExpectations(categories, CATEGORIES_MOCK);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: categoryRepository.findAll,
      calledWith: { id: 1 }
    });
  });

  it("should return an empty array if the user has no categories", async () => {
    jest.spyOn(categoryRepository, "findAll").mockResolvedValue([]);

    const categories = await sut.execute(1);

    testUtils.resultExpectations(categories, []);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: categoryRepository.findAll,
      calledWith: { id: 1 }
    });
  });
});
