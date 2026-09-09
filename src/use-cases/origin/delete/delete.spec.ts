import { OriginRepository } from "@domain/repositories/origin.repository";
import { DeleteOriginUseCase } from "./delete.use-case";
import { OriginRepositoryStub } from "@test/stubs/repositories/origin";
import { ORIGIN_MOCK } from "@test/mocks/origin.mock";
import { ExceptionsAdapter } from "@domain/adapters/exceptions.adapter";
import { ExceptionsAdapterStub } from "@test/stubs/adapters/exceptions.stub";

describe("DeleteOriginUseCase", () => {
  let sut: DeleteOriginUseCase;
  let originRepository: OriginRepository;
  let exceptionsAdapter: ExceptionsAdapter;

  beforeEach(() => {
    originRepository = new OriginRepositoryStub();
    exceptionsAdapter = new ExceptionsAdapterStub();
    sut = new DeleteOriginUseCase(originRepository, exceptionsAdapter);
  });

  it("should delete an origin", async () => {
    jest.spyOn(originRepository, "delete");
    jest.spyOn(originRepository, "hasTransactions").mockResolvedValue(false);

    await sut.execute(ORIGIN_MOCK.id);

    expect(originRepository.delete).toHaveBeenCalledWith(ORIGIN_MOCK.id);
  });

  it("should not delete an origin used by a transaction", async () => {
    jest.spyOn(originRepository, "hasTransactions").mockResolvedValue(true);
    jest.spyOn(originRepository, "delete");
    jest.spyOn(exceptionsAdapter, "badRequest");

    await sut.execute(ORIGIN_MOCK.id);

    expect(exceptionsAdapter.badRequest).toHaveBeenCalledWith({
      message:
        "This origin cannot be deleted because it is used by transactions"
    });
    expect(originRepository.delete).not.toHaveBeenCalled();
  });
});
