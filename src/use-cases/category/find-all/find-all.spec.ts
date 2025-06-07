import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { CategoryRepository } from "@domain/repositories/category.repository";
import { UserRepository } from "@domain/repositories/user.repository";
import { FindAllCategoryUseCase } from "./find-all.use-case";
import { ExceptionsAdapterStub } from "@test/stubs/adapters/exceptions.stub";
import { UserRepositoryStub } from "@test/stubs/repositories/user.stub";
import { CategoryRepositoryStub } from "@test/stubs/repositories/category.stub";
import { CATEGORIES_MOCK } from "@test/mocks/category.mock";
import { USER_MOCK } from "@test/mocks/user.mock";

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
    jest.spyOn(userRepository, "findById").mockResolvedValue(USER_MOCK);
    jest.spyOn(exceptionsAdapter, "notFound");

    const categories = await sut.execute(1);

    expect(categoryRepository.findAll).toHaveBeenCalledTimes(1);
    expect(userRepository.findById).toHaveBeenCalledTimes(1);
    expect(exceptionsAdapter.notFound).not.toHaveBeenCalled();
    expect(categories).toEqual(CATEGORIES_MOCK);
  });

  it("should return an empty array if the user has no categories", async () => {
    jest.spyOn(categoryRepository, "findAll").mockResolvedValue([]);
    jest.spyOn(userRepository, "findById").mockResolvedValue(USER_MOCK);
    jest.spyOn(exceptionsAdapter, "notFound");

    const categories = await sut.execute(1);

    expect(categoryRepository.findAll).toHaveBeenCalledTimes(1);
    expect(userRepository.findById).toHaveBeenCalledTimes(1);
    expect(exceptionsAdapter.notFound).not.toHaveBeenCalled();
    expect(categories).toEqual([]);
  });

  it("should throw an error if the user id is not found", async () => {
    jest.spyOn(userRepository, "findById").mockResolvedValue(null);
    jest.spyOn(categoryRepository, "findAll");
    jest.spyOn(exceptionsAdapter, "notFound");

    await sut.execute(1);

    expect(userRepository.findById).toHaveBeenCalledTimes(1);
    expect(categoryRepository.findAll).not.toHaveBeenCalled();
    expect(categoryRepository.findAll).not.toHaveBeenCalled();
    expect(exceptionsAdapter.notFound).toHaveBeenCalledTimes(1);
    expect(exceptionsAdapter.notFound).toHaveBeenCalledWith({
      message: "User not found"
    });
  });
});
