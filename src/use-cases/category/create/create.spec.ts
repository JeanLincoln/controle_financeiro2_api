import { CategoryRepositoryStub } from "@test/stubs/repositories/category.stub";
import { CreateCategoryUseCase } from "./create.use-case";
import type { CategoryRepository } from "@domain/repositories/category.repository";
import { CategoryType } from "@domain/entities/category.entity";
import type { UserRepository } from "@domain/repositories/user.repository";
import { UserRepositoryStub } from "@test/stubs/repositories/user.stub";
import type { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { ExceptionsAdapterStub } from "@test/stubs/adapters/exceptions.stub";
import type { User } from "@domain/entities/user.entity";

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

  const CATEGORY_MOCK = {
    name: "Test Category",
    description: "Test category description",
    type: CategoryType.INCOME,
    color: "#FF0000",
    icon: "test-icon",
    userId: 1
  };

  const USER_MOCK: User = {
    id: 1,
    firstName: "Test",
    lastName: "User",
    email: "test@test.com",
    password: "123456",
    birthDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  };

  it("should be able to create a category", async () => {
    jest.spyOn(categoryRepository, "create");
    jest.spyOn(exceptionsAdapter, "notFound");
    jest.spyOn(userRepository, "findById").mockResolvedValue(USER_MOCK);

    await sut.execute(CATEGORY_MOCK);

    expect(userRepository.findById).toHaveBeenCalledTimes(1);
    expect(categoryRepository.create).toHaveBeenCalledWith(CATEGORY_MOCK);
  });

  it("should not be able to create a category if user does not exist", async () => {
    jest.spyOn(userRepository, "findById").mockResolvedValue(null);
    jest.spyOn(categoryRepository, "create");

    sut.execute(CATEGORY_MOCK);

    expect(userRepository.findById).toHaveBeenCalledTimes(1);
    expect(categoryRepository.create).not.toHaveBeenCalled();
  });
});
