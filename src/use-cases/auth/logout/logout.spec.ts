import { generateResponseMock } from "@test/mocks/auth.mock";
import { LogoutUseCase } from "./logout.use-case";

describe("LogoutUseCase", () => {
  let logoutUseCase: LogoutUseCase;

  beforeEach(() => {
    logoutUseCase = new LogoutUseCase();
  });

  it("should clear the Authorization cookie", async () => {
    const RES_MOCK = generateResponseMock();

    await logoutUseCase.execute(RES_MOCK);

    expect(RES_MOCK.clearCookie).toHaveBeenCalledWith("Authorization", {
      httpOnly: true,
      secure: true,
      sameSite: "strict"
    });
  });
});
