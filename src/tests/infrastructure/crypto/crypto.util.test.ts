import { CryptoUtil } from "../../../infrastructure/crypto/crypto.util";

describe("crypto util", () => {
  let cryptoUtil: CryptoUtil;
  const PASS_WORD = "testpassword12344";

  beforeAll(() => {
    cryptoUtil = new CryptoUtil();
  });

  test("encrypt password", async () => {
    const { key } = await cryptoUtil.encryptPassword(PASS_WORD);

    expect(typeof key).toBe("string");
  });

  describe("verify password", () => {
    test("valid", async () => {
      const { key } = await cryptoUtil.encryptPassword(PASS_WORD);

      const isValidPassword = await cryptoUtil.verifyPassword(key, PASS_WORD);

      expect(isValidPassword).toEqual(true);
    });
    test("invalid", async () => {
      const { key } = await cryptoUtil.encryptPassword(PASS_WORD);

      const isValidPassword = await cryptoUtil.verifyPassword(
        key,
        `${PASS_WORD}invalid`
      );

      expect(isValidPassword).toEqual(false);
    });
  });
});
