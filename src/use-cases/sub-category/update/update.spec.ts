import { SubCategoryRepository } from "@domain/repositories/sub-category.repository";
import { UpdateSubCategoryUseCase } from "./update.use-case";
import { SubCategoryRepositoryStub } from "@test/stubs/repositories/sub-category.stub";
import {
  CREATE_SUB_CATEGORY_MOCK,
  SUB_CATEGORY_MOCK_1
} from "@test/mocks/sub-category.mock";
import { INCOME_CATEGORY_MOCK } from "@test/mocks/category.mock";
import { USER_MOCK } from "@test/mocks/user.mock";

describe("UpdateSubCategoryUseCase", () => {
  let sut: UpdateSubCategoryUseCase;
  let subCategoryRepository: SubCategoryRepository;

  beforeEach(() => {
    subCategoryRepository = new SubCategoryRepositoryStub();
    sut = new UpdateSubCategoryUseCase(subCategoryRepository);
  });

  it("should be able to update a sub category", async () => {
    jest.spyOn(subCategoryRepository, "update");

    const result = await sut.execute(
      SUB_CATEGORY_MOCK_1.id,
      INCOME_CATEGORY_MOCK.id,
      CREATE_SUB_CATEGORY_MOCK
    );

    testUtils.resultExpectations(result, undefined);
    testUtils.timesCalledExpectations({
      calledWith: [
        USER_MOCK.id,
        INCOME_CATEGORY_MOCK.id,
        CREATE_SUB_CATEGORY_MOCK
      ],
      mockFunction: subCategoryRepository.update,
      times: 1
    });
  });
});
