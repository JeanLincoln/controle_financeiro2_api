import { CategoryRepositoryStub } from "@test/stubs/repositories/category.stub";
import { FindByIdCategoryUseCase } from "./find-by-id.use-case";
import { UserRepositoryStub } from "@test/stubs/repositories/user.stub";
import { CategoryRepository } from "@domain/repositories/category.repository";
import { UserRepository } from "@domain/repositories/user.repository";
import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { ExceptionsAdapterStub } from "@test/stubs/adapters/exceptions.stub";
import { User } from "@domain/entities/user.entity";
import { CategoryType, type Category } from "@domain/entities/category.entity";
import * as testUtils from "@test/utils/test-utils";

describe("FindByIdCategoryUseCase", () => {
  let sut: FindByIdCategoryUseCase;
  let categoryRepository: CategoryRepository;
  let userRepository: UserRepository;
  let exceptionsAdapter: ExceptionsAdapter;

  beforeEach(() => {
    categoryRepository = new CategoryRepositoryStub();
    userRepository = new UserRepositoryStub();
    exceptionsAdapter = new ExceptionsAdapterStub();
    sut = new FindByIdCategoryUseCase(
      exceptionsAdapter,
      categoryRepository,
      userRepository
    );

    jest.spyOn(exceptionsAdapter, "notFound");
    jest.spyOn(exceptionsAdapter, "forbidden");
  });

  const USER_MOCK: User = {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    birthDate: new Date("1990-01-01"),
    email: "john.doe@example.com",
    password: "123456",
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const CATEGORY_MOCK: Category = {
    id: 1,
    name: "Category 1",
    description: "Category 1 description",
    type: CategoryType.EXPENSE,
    color: "#000000",
    icon: "💰",
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const CATEGORY_MOCK_2: Category = {
    ...CATEGORY_MOCK,
    userId: 2,
    id: 2
  };

  it("should be able to find a category by id", async () => {
    jest.spyOn(userRepository, "findById").mockResolvedValue(USER_MOCK);
    jest.spyOn(categoryRepository, "findById").mockResolvedValue(CATEGORY_MOCK);

    const result = await sut.execute(USER_MOCK.id, CATEGORY_MOCK.id);

    testUtils.resultExpectations(result, CATEGORY_MOCK);

    testUtils.notCalledExpectations([
      exceptionsAdapter.notFound,
      exceptionsAdapter.forbidden
    ]);

    testUtils.timesCalledExpectations({
      mockFunction: userRepository.findById,
      calledWith: USER_MOCK.id,
      times: 1
    });

    testUtils.timesCalledExpectations({
      mockFunction: categoryRepository.findById,
      calledWith: CATEGORY_MOCK.id,
      times: 1
    });
  });

  it("should not be able to find a category by id if the user does not exist", async () => {
    jest.spyOn(userRepository, "findById").mockResolvedValue(null);
    jest.spyOn(categoryRepository, "findById");

    const result = await sut.execute(USER_MOCK.id, CATEGORY_MOCK.id);

    testUtils.resultExpectations(result, undefined);

    testUtils.notCalledExpectations([
      exceptionsAdapter.forbidden,
      categoryRepository.findById
    ]);

    testUtils.timesCalledExpectations({
      mockFunction: userRepository.findById,
      calledWith: USER_MOCK.id,
      times: 1
    });

    testUtils.timesCalledExpectations({
      mockFunction: exceptionsAdapter.notFound,
      calledWith: {
        message: "User not found"
      },
      times: 1
    });
  });

  it("should not be able to find a category by id if the category does not exist", async () => {
    jest.spyOn(userRepository, "findById").mockResolvedValue(USER_MOCK);
    jest.spyOn(categoryRepository, "findById").mockResolvedValue(null);

    const result = await sut.execute(USER_MOCK.id, CATEGORY_MOCK.id);

    testUtils.resultExpectations(result, undefined);
    testUtils.notCalledExpectations([exceptionsAdapter.forbidden]);

    testUtils.timesCalledExpectations({
      mockFunction: userRepository.findById,
      calledWith: USER_MOCK.id,
      times: 1
    });

    testUtils.timesCalledExpectations({
      mockFunction: categoryRepository.findById,
      calledWith: CATEGORY_MOCK.id,
      times: 1
    });

    testUtils.timesCalledExpectations({
      mockFunction: exceptionsAdapter.notFound,
      calledWith: {
        message: "Category not found"
      },
      times: 1
    });
  });

  it("should throw an error if the category belongs to another user", async () => {
    jest.spyOn(userRepository, "findById").mockResolvedValue(USER_MOCK);
    jest
      .spyOn(categoryRepository, "findById")
      .mockResolvedValue(CATEGORY_MOCK_2);

    const result = await sut.execute(USER_MOCK.id, CATEGORY_MOCK_2.id);

    testUtils.resultExpectations(result, undefined);
    testUtils.notCalledExpectations([exceptionsAdapter.notFound]);

    testUtils.timesCalledExpectations({
      mockFunction: userRepository.findById,
      calledWith: USER_MOCK.id,
      times: 1
    });

    testUtils.timesCalledExpectations({
      mockFunction: categoryRepository.findById,
      calledWith: CATEGORY_MOCK_2.id,
      times: 1
    });

    testUtils.timesCalledExpectations({
      mockFunction: exceptionsAdapter.forbidden,
      calledWith: {
        message: "You are not allowed to access this category"
      },
      times: 1
    });
  });
});
