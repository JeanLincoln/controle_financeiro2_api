import { OriginRepository } from "@domain/repositories/origin.repository";
import { CreateOriginUseCase } from "./create.use-case";
import { OriginRepositoryStub } from "@test/stubs/repositories/origin";
import { USER_MOCK } from "@test/mocks/user.mock";
import { CREATE_OR_UPDATE_ORIGIN_MOCK } from "@test/mocks/origin.mock";

describe("CreateOriginUseCase", () => {
  let sut: CreateOriginUseCase;
  let originRepository: OriginRepository;

  beforeEach(() => {
    originRepository = new OriginRepositoryStub();
    sut = new CreateOriginUseCase(originRepository);
  });

  it("should create an origin", async () => {
    jest.spyOn(originRepository, "create");

    const result = await sut.execute(CREATE_OR_UPDATE_ORIGIN_MOCK);

    testUtils.resultExpectations(result, undefined);

    expect(originRepository.create).toHaveBeenCalledWith({
      ...CREATE_OR_UPDATE_ORIGIN_MOCK,
      userId: USER_MOCK.id
    });
  });
});
