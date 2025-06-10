import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { FindAllSubCategoryUseCase } from "./find-all.find-all.use-case";
import { ExceptionsAdapterStub } from "@test/stubs/adapters/exceptions.stub";
import { SubCategoryRepositoryStub } from "@test/stubs/repositories/sub-category.stub";
import { SubCategoryRepository } from "@domain/repositories/sub-category.repository";
import { SUB_CATEGORIES_MOCK } from "@test/mocks/sub-category.mock";
import { USER_MOCK } from "@test/mocks/user.mock";

describe("FindAllSubCategoryUseCase", () => {
  let sut: FindAllSubCategoryUseCase;
  let subCategoryRepository: SubCategoryRepository;
  let exceptionAdapter: ExceptionsAdapter;

  beforeEach(() => {
    subCategoryRepository = new SubCategoryRepositoryStub();
    exceptionAdapter = new ExceptionsAdapterStub();
    sut = new FindAllSubCategoryUseCase(
      subCategoryRepository,
      exceptionAdapter
    );

    jest.spyOn(exceptionAdapter, "notFound");
  });

  it("should be able to find all sub-categories of a user", async () => {
    jest
      .spyOn(subCategoryRepository, "findAllByUserId")
      .mockResolvedValue(SUB_CATEGORIES_MOCK);

    const result = await sut.execute(USER_MOCK.id);

    testUtils.notCalledExpectations([exceptionAdapter.notFound]);
    testUtils.arrayExpectations({
      result,
      expected: SUB_CATEGORIES_MOCK,
      length: SUB_CATEGORIES_MOCK.length
    });
  });

  it("should return an empty array if the user has no sub-categories", async () => {
    jest.spyOn(subCategoryRepository, "findAllByUserId").mockResolvedValue([]);

    const result = await sut.execute(USER_MOCK.id);

    testUtils.notCalledExpectations([exceptionAdapter.notFound]);
    testUtils.arrayExpectations({
      result,
      expected: [],
      length: 0
    });
  });
});
