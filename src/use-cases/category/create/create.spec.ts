import { CategoryRepositoryStub } from "@test/stubs/repositories/category.stub";
import { CreateCategoryUseCase } from "./create.use-case";
import { CategoryRepository } from "@domain/repositories/category.repository";
import { CREATE_OR_UPDATE_CATEGORY_MOCK } from "@test/mocks/category.mock";
import { USER_MOCK } from "@test/mocks/user.mock";
describe("LoginUseCase", () => {
  let sut: CreateCategoryUseCase;
  let categoryRepository: CategoryRepository;

  beforeEach(() => {
    categoryRepository = new CategoryRepositoryStub();
    sut = new CreateCategoryUseCase(categoryRepository);
  });

  it("should be able to create a category", async () => {
    jest.spyOn(categoryRepository, "create");

    await sut.execute(USER_MOCK, CREATE_OR_UPDATE_CATEGORY_MOCK);

    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: categoryRepository.create,
      calledWith: [USER_MOCK, CREATE_OR_UPDATE_CATEGORY_MOCK]
    });
  });
});
