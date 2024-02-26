import { JwtUtil } from "../../../infrastructure/jwt/jwt.util";

const jwtUtil = new JwtUtil({
  AUTH_SIGN_IN_ACCESS_JWT_SECRET: "secret",
  AUTH_SIGN_IN_ACCESS_EXP_DURATION_SEC: "10",
  AUTH_SIGN_IN_REFRESH_JWT_SECRET: "secret",
  AUTH_SIGN_IN_REFRESH_EXP_DURATION_SEC: "10",
  AUTH_EMAIL_VERIFY_JWT_SECRET: "secret",
  AUTH_EMAIL_VERIFY_EXP_DURATION_SEC: "10",
});

export default {
  async fetch(request: Request, env: any, ctx: any) {
    if (request.url.includes("sign")) {
      const body = await request.json<any>();
      const token = await jwtUtil.signAuthAccessPayload(body);

      return new Response(
        JSON.stringify({
          token,
        })
      );
    } else if (request.url.includes("verify")) {
      const { token } = await request.json<any>();

      const isVerified = await jwtUtil.verifyAuthAccessToken(token);

      return new Response(
        JSON.stringify({
          isVerified,
        })
      );
    } else if (request.url.includes("decode")) {
      const { token } = await request.json<any>();
      const { payload } = jwtUtil.decodePayload(token);

      return new Response(JSON.stringify({ decode: payload }));
    }

    return new Response("Not Found", { status: 400 });
  },
};
