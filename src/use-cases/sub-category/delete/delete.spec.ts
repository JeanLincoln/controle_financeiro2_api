import { SubCategoryRepository } from "@domain/repositories/sub-category.repository";
import { DeleteSubCategoryUseCase } from "./delete.use-case";
import { SubCategoryRepositoryStub } from "@test/stubs/repositories/sub-category.stub";
import { SUB_CATEGORY_MOCK_1 } from "@test/mocks/sub-category.mock";

describe("DeleteSubCategoryUseCase", () => {
  let sut: DeleteSubCategoryUseCase;
  let subCategoryRepository: SubCategoryRepository;

  beforeEach(() => {
    subCategoryRepository = new SubCategoryRepositoryStub();
    sut = new DeleteSubCategoryUseCase(subCategoryRepository);
  });

  it("should be able to delete a sub category", async () => {
    jest.spyOn(subCategoryRepository, "delete");

    const result = await sut.execute(SUB_CATEGORY_MOCK_1.id);

    testUtils.resultExpectations(result, undefined);
    testUtils.timesCalledExpectations({
      times: 1,
      mockFunction: subCategoryRepository.delete,
      calledWith: [SUB_CATEGORY_MOCK_1.id]
    });
  });
});
