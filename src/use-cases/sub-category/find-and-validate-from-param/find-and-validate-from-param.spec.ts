import { SubCategoryRepository } from "@domain/repositories/sub-category.repository";
import { FindAndValidateFromParamSubCategoryUseCase } from "./find-and-validate-from-param.use-case";
import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { SubCategoryRepositoryStub } from "@test/stubs/repositories/sub-category.stub";
import { ExceptionsAdapterStub } from "@test/stubs/adapters/exceptions.stub";
import {
  SUB_PARAM_CATEGORY_AUTHENTICATED_REQUEST_MOCK,
  SUB_PARAM_CATEGORY_AUTHENTICATED_REQUEST_MOCK_2,
  SUB_CATEGORY_MOCK_1,
  SUB_CATEGORY_MOCK_2
} from "@test/mocks/sub-category.mock";

describe("FindAndValidateFromParamSubCategoryUseCase", () => {
  let sut: FindAndValidateFromParamSubCategoryUseCase;
  let subCategoryRepository: SubCategoryRepository;
  let exceptionsAdapter: ExceptionsAdapter;

  beforeEach(() => {
    subCategoryRepository = new SubCategoryRepositoryStub();
    exceptionsAdapter = new ExceptionsAdapterStub();
    sut = new FindAndValidateFromParamSubCategoryUseCase(
      subCategoryRepository,
      exceptionsAdapter
    );

    jest.spyOn(exceptionsAdapter, "notFound");
    jest.spyOn(exceptionsAdapter, "forbidden");
    jest.spyOn(exceptionsAdapter, "badRequest");
  });

  it("should return true and set the sub category in the request if all validations pass", async () => {
    jest
      .spyOn(subCategoryRepository, "findById")
      .mockResolvedValue(SUB_CATEGORY_MOCK_1);

    const result = await sut.execute(
      SUB_PARAM_CATEGORY_AUTHENTICATED_REQUEST_MOCK
    );

    testUtils.resultExpectations(result, true);
    testUtils.resultExpectations(
      SUB_PARAM_CATEGORY_AUTHENTICATED_REQUEST_MOCK.subCategory,
      SUB_CATEGORY_MOCK_1
    );
    testUtils.notCalledExpectations([
      exceptionsAdapter.notFound,
      exceptionsAdapter.forbidden,
      exceptionsAdapter.badRequest
    ]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: subCategoryRepository.findById,
      calledWith: [SUB_CATEGORY_MOCK_1.id]
    });
  });

  it("should return false if the sub category is not found", async () => {
    jest.spyOn(subCategoryRepository, "findById").mockResolvedValue(null);

    const result = await sut.execute(
      SUB_PARAM_CATEGORY_AUTHENTICATED_REQUEST_MOCK
    );

    testUtils.resultExpectations(result, false);
    testUtils.notCalledExpectations([
      exceptionsAdapter.forbidden,
      exceptionsAdapter.badRequest
    ]);
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

    const result = await sut.execute(
      SUB_PARAM_CATEGORY_AUTHENTICATED_REQUEST_MOCK
    );

    testUtils.resultExpectations(result, false);
    testUtils.notCalledExpectations([
      exceptionsAdapter.notFound,
      exceptionsAdapter.badRequest
    ]);
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
      calledWith: [
        Number(
          SUB_PARAM_CATEGORY_AUTHENTICATED_REQUEST_MOCK.params.subCategoryId
        )
      ]
    });
  });

  it("should return false if the sub category does not belong to the category informed", async () => {
    jest
      .spyOn(subCategoryRepository, "findById")
      .mockResolvedValue(SUB_CATEGORY_MOCK_1);

    const result = await sut.execute(
      SUB_PARAM_CATEGORY_AUTHENTICATED_REQUEST_MOCK_2
    );

    testUtils.resultExpectations(result, false);
    testUtils.notCalledExpectations([
      exceptionsAdapter.notFound,
      exceptionsAdapter.forbidden
    ]);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: exceptionsAdapter.badRequest,
      calledWith: [
        {
          message: "This sub category does not belong to the category informed"
        }
      ]
    });
  });
});
