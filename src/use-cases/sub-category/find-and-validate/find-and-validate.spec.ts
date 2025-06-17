import { SubCategoryRepository } from "@domain/repositories/sub-category.repository";
import { FindAndValidateSubCategoryUseCase } from "./find-and-validate.use-case";
import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { SubCategoryRepositoryStub } from "@test/stubs/repositories/sub-category.stub";
import { ExceptionsAdapterStub } from "@test/stubs/adapters/exceptions.stub";
import {
  SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK,
  SUB_CATEGORY_MOCK_1,
  SUB_CATEGORY_MOCK_2
} from "@test/mocks/sub-category.mock";

describe("FindAndValidateSubCategoryUseCase", () => {
  let sut: FindAndValidateSubCategoryUseCase;
  let subCategoryRepository: SubCategoryRepository;
  let exceptionsAdapter: ExceptionsAdapter;

  beforeEach(() => {
    subCategoryRepository = new SubCategoryRepositoryStub();
    exceptionsAdapter = new ExceptionsAdapterStub();
    sut = new FindAndValidateSubCategoryUseCase(
      subCategoryRepository,
      exceptionsAdapter
    );

    jest.spyOn(exceptionsAdapter, "notFound");
    jest.spyOn(exceptionsAdapter, "forbidden");
  });

  it("should return true and set the sub category in the request if all validations pass", async () => {
    jest
      .spyOn(subCategoryRepository, "findById")
      .mockResolvedValue(SUB_CATEGORY_MOCK_1);

    const result = await sut.execute(SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK);

    testUtils.resultExpectations(result, true);
    testUtils.resultExpectations(
      SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK.subCategory,
      SUB_CATEGORY_MOCK_1
    );
    testUtils.notCalledExpectations([
      exceptionsAdapter.notFound,
      exceptionsAdapter.forbidden
    ]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: subCategoryRepository.findById,
      calledWith: [SUB_CATEGORY_MOCK_1.id]
    });
  });

  it("should return false if the sub category is not found", async () => {
    jest.spyOn(subCategoryRepository, "findById").mockResolvedValue(null);

    const result = await sut.execute(SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK);

    testUtils.resultExpectations(result, false);
    testUtils.notCalledExpectations([exceptionsAdapter.forbidden]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: subCategoryRepository.findById,
      calledWith: [SUB_CATEGORY_MOCK_1.id]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: exceptionsAdapter.notFound,
      calledWith: [{ message: "Sub category not found" }]
    });
  });

  it("should return false if the sub category is not owned by the user", async () => {
    jest
      .spyOn(subCategoryRepository, "findById")
      .mockResolvedValue(SUB_CATEGORY_MOCK_2);

    const result = await sut.execute(SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK);

    testUtils.resultExpectations(result, false);
    testUtils.notCalledExpectations([exceptionsAdapter.notFound]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: exceptionsAdapter.forbidden,
      calledWith: [
        { message: "You are not allowed to access this sub category" }
      ]
    });
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: subCategoryRepository.findById,
      calledWith: [Number(SUB_CATEGORY_AUTHENTICATED_REQUEST_MOCK.params.id)]
    });
  });
});
