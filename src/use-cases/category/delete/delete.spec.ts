import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { CategoryRepository } from "@domain/repositories/category.repository";
import { UserRepository } from "@domain/repositories/user.repository";
import { ExceptionsAdapterStub } from "@test/stubs/adapters/exceptions.stub";
import { CategoryRepositoryStub } from "@test/stubs/repositories/category.stub";
import { UserRepositoryStub } from "@test/stubs/repositories/user.stub";
import { DeleteCategoryUseCase } from "./delete.use-case";
import { USER_MOCK } from "@test/mocks/user.mock";
import {
  USER_1_CATEGORIES_MOCK,
  USER_2_CATEGORIES_MOCK
} from "@test/mocks/category.mock";
describe("DeleteCategoryUseCase", () => {
  let sut: DeleteCategoryUseCase;
  let categoryRepository: CategoryRepository;
  let userRepository: UserRepository;
  let exceptionsAdapter: ExceptionsAdapter;

  beforeEach(() => {
    categoryRepository = new CategoryRepositoryStub();
    userRepository = new UserRepositoryStub();
    exceptionsAdapter = new ExceptionsAdapterStub();
    sut = new DeleteCategoryUseCase(
      categoryRepository,
      userRepository,
      exceptionsAdapter
    );

    jest.spyOn(exceptionsAdapter, "notFound");
    jest.spyOn(exceptionsAdapter, "forbidden");
  });

  it("should be able to delete a category", async () => {
    jest
      .spyOn(categoryRepository, "findById")
      .mockResolvedValue(USER_1_CATEGORIES_MOCK[0]);
    jest.spyOn(categoryRepository, "delete");
    jest.spyOn(userRepository, "findById").mockResolvedValue(USER_MOCK);

    const result = await sut.execute(
      USER_MOCK.id,
      USER_1_CATEGORIES_MOCK[0].id
    );

    testUtils.resultExpectations(result, undefined);
    testUtils.notCalledExpectations([
      exceptionsAdapter.notFound,
      exceptionsAdapter.forbidden
    ]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: userRepository.findById,
      calledWith: [USER_MOCK.id]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: categoryRepository.findById,
      calledWith: [USER_1_CATEGORIES_MOCK[0].id]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: categoryRepository.delete,
      calledWith: [USER_1_CATEGORIES_MOCK[0].id]
    });
  });

  it("should not be able to delete a category that does not exist", async () => {
    jest.spyOn(categoryRepository, "findById").mockResolvedValue(null);
    jest.spyOn(categoryRepository, "delete");
    jest.spyOn(userRepository, "findById").mockResolvedValue(USER_MOCK);

    const result = await sut.execute(
      USER_MOCK.id,
      USER_1_CATEGORIES_MOCK[0].id
    );

    testUtils.resultExpectations(result, undefined);
    testUtils.notCalledExpectations([
      exceptionsAdapter.forbidden,
      categoryRepository.delete
    ]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: userRepository.findById,
      calledWith: [USER_MOCK.id]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: categoryRepository.findById,
      calledWith: [USER_1_CATEGORIES_MOCK[0].id]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: exceptionsAdapter.notFound,
      calledWith: [{ message: "Category not found" }]
    });
  });

  it("should not be able to delete a category of another user", async () => {
    jest
      .spyOn(categoryRepository, "findById")
      .mockResolvedValue(USER_2_CATEGORIES_MOCK[0]);
    jest.spyOn(categoryRepository, "delete");
    jest.spyOn(userRepository, "findById").mockResolvedValue(USER_MOCK);

    const result = await sut.execute(
      USER_MOCK.id,
      USER_2_CATEGORIES_MOCK[0].id
    );

    testUtils.resultExpectations(result, undefined);
    testUtils.notCalledExpectations([
      exceptionsAdapter.notFound,
      categoryRepository.delete
    ]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: userRepository.findById,
      calledWith: [USER_MOCK.id]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: categoryRepository.findById,
      calledWith: [USER_2_CATEGORIES_MOCK[0].id]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: exceptionsAdapter.forbidden,
      calledWith: [{ message: "You are not allowed to delete this category" }]
    });
  });
});
