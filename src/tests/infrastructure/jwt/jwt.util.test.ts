import { UnstableDevWorker, unstable_dev } from "wrangler";

describe("crypto util", () => {
  let worker: UnstableDevWorker;
  beforeAll(async () => {
    worker = await unstable_dev("src/tests/infrastructure/jwt/index.test.ts", {
      experimental: { disableExperimentalWarning: true },
    });
  });

  afterAll(async () => {
    await worker.stop();
  });

  test("jwt util", async () => {
    const payload = { uuid: "test", role: 1, userId: 1 };

    const tokenRes = await worker.fetch("sign", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const { token } = (await tokenRes.json()) as any;

    expect(typeof token).toEqual("string");

    const verifiedRes = await worker.fetch("verify", {
      method: "POST",
      body: JSON.stringify({ token }),
    });

    const { isVerified } = (await verifiedRes.json()) as any;

    expect(isVerified).toEqual(true);

    const decodeRes = await worker.fetch("decode", {
      method: "POST",
      body: JSON.stringify({ token }),
    });

    const { decode } = (await decodeRes.json()) as any;

    for (const [key, value] of Object.entries(payload)) {
      expect(value).toEqual(decode[key as any as keyof typeof decode]);
    }
  });
});
