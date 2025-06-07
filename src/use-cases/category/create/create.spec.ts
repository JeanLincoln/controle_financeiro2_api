import { CategoryRepositoryStub } from "@test/stubs/repositories/category.stub";
import { CreateCategoryUseCase } from "./create.use-case";
import { CategoryRepository } from "@domain/repositories/category.repository";
import { UserRepository } from "@domain/repositories/user.repository";
import { UserRepositoryStub } from "@test/stubs/repositories/user.stub";
import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { ExceptionsAdapterStub } from "@test/stubs/adapters/exceptions.stub";
import {
  EXPENSE_CATEGORY_MOCK,
  INCOME_CATEGORY_MOCK
} from "@test/mocks/category.mock";
import { USER_MOCK } from "@test/mocks/user.mock";

describe("LoginUseCase", () => {
  let sut: CreateCategoryUseCase;
  let categoryRepository: CategoryRepository;
  let userRepository: UserRepository;
  let exceptionsAdapter: ExceptionsAdapter;

  beforeEach(() => {
    categoryRepository = new CategoryRepositoryStub();
    userRepository = new UserRepositoryStub();
    exceptionsAdapter = new ExceptionsAdapterStub();
    sut = new CreateCategoryUseCase(
      categoryRepository,
      userRepository,
      exceptionsAdapter
    );
  });

  it("should be able to create a category", async () => {
    jest.spyOn(categoryRepository, "create");
    jest.spyOn(exceptionsAdapter, "notFound");
    jest.spyOn(userRepository, "findById").mockResolvedValue(USER_MOCK);

    await sut.execute(1, EXPENSE_CATEGORY_MOCK);

    expect(userRepository.findById).toHaveBeenCalledTimes(1);
    expect(categoryRepository.create).toHaveBeenCalledWith(
      EXPENSE_CATEGORY_MOCK
    );
  });

  it("should not be able to create a category if user does not exist", async () => {
    jest.spyOn(userRepository, "findById").mockResolvedValue(null);
    jest.spyOn(categoryRepository, "create");

    await sut.execute(1, INCOME_CATEGORY_MOCK);

    expect(userRepository.findById).toHaveBeenCalledTimes(1);
    expect(categoryRepository.create).not.toHaveBeenCalled();
  });
});
