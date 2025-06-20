import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { CategoryRepository } from "@domain/repositories/category.repository";
import { UserRepository } from "@domain/repositories/user.repository";
import { FindAllCategoryUseCase } from "./find-all.use-case";
import { ExceptionsAdapterStub } from "@test/stubs/adapters/exceptions.stub";
import { UserRepositoryStub } from "@test/stubs/repositories/user.stub";
import { CategoryRepositoryStub } from "@test/stubs/repositories/category.stub";
import { CATEGORIES_MOCK } from "@test/mocks/category.mock";

describe("FindAllCategoryUseCase", () => {
  let sut: FindAllCategoryUseCase;
  let categoryRepository: CategoryRepository;
  let userRepository: UserRepository;
  let exceptionsAdapter: ExceptionsAdapter;

  beforeEach(() => {
    categoryRepository = new CategoryRepositoryStub();
    userRepository = new UserRepositoryStub();
    exceptionsAdapter = new ExceptionsAdapterStub();
    sut = new FindAllCategoryUseCase(
      exceptionsAdapter,
      categoryRepository,
      userRepository
    );
  });

  it("should be able to find all categories by user id", async () => {
    jest
      .spyOn(categoryRepository, "findAll")
      .mockResolvedValue(CATEGORIES_MOCK);
    jest.spyOn(exceptionsAdapter, "notFound");

    const categories = await sut.execute(1);

    testUtils.resultExpectations(categories, CATEGORIES_MOCK);
    testUtils.notCalledExpectations([exceptionsAdapter.notFound]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: categoryRepository.findAll,
      calledWith: { id: 1 }
    });
  });

  it("should return an empty array if the user has no categories", async () => {
    jest.spyOn(categoryRepository, "findAll").mockResolvedValue([]);
    jest.spyOn(exceptionsAdapter, "notFound");

    const categories = await sut.execute(1);

    testUtils.resultExpectations(categories, []);
    testUtils.notCalledExpectations([exceptionsAdapter.notFound]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: categoryRepository.findAll,
      calledWith: { id: 1 }
    });
  });
});
