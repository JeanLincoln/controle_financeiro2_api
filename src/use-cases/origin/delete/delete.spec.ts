import { OriginRepository } from "@domain/repositories/origin.repository";
import { DeleteOriginUseCase } from "./delete.use-case";
import { OriginRepositoryStub } from "@test/stubs/repositories/origin";
import { ORIGIN_MOCK } from "@test/mocks/origin.mock";

describe("DeleteOriginUseCase", () => {
  let sut: DeleteOriginUseCase;
  let originRepository: OriginRepository;

  beforeEach(() => {
    originRepository = new OriginRepositoryStub();
    sut = new DeleteOriginUseCase(originRepository);
  });

  it("should delete an origin", async () => {
    jest.spyOn(originRepository, "delete");

    await sut.execute(ORIGIN_MOCK.id);

    expect(originRepository.delete).toHaveBeenCalledWith(ORIGIN_MOCK.id);
  });
});
