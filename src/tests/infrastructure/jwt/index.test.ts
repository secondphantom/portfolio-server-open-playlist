import { JwtUtil } from "../../../infrastructure/jwt/jwt.util";

const jwtUtil = new JwtUtil({
  AUTH_EMAIL_VERIFY_EXP_DURATION_SEC: 10,
  AUTH_EMAIL_VERIFY_JWT_SECRET: "secret",
  AUTH_SIGN_IN_EXP_DURATION_SEC: 10,
  AUTH_SIGN_IN_JWT_SECRET: "secret",
});

export default {
  async fetch(request: Request, env: any, ctx: any) {
    if (request.url.includes("sign")) {
      const body = await request.json<any>();
      const token = await jwtUtil.signAuth(body);

      return new Response(
        JSON.stringify({
          token,
        })
      );
    } else if (request.url.includes("verify")) {
      const { token } = await request.json<any>();

      const isVerified = await jwtUtil.verifyAuth(token);

      return new Response(
        JSON.stringify({
          isVerified,
        })
      );
    } else if (request.url.includes("decode")) {
      const { token } = await request.json<any>();
      const { payload } = jwtUtil.decode(token);

      return new Response(JSON.stringify({ decode: payload }));
    }

    return new Response("Not Found", { status: 400 });
  },
};
