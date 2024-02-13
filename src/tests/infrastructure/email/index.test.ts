import { EmailUtil } from "../../../infrastructure/email/email.util";

const emailUtil = new EmailUtil();

export default {
  async fetch(request: Request, env: any, ctx: any) {
    const token = "test_token";

    const inputs = {
      from: {
        email: `noreplay@${env.DOMAIN_URL}`,
        name: env.SERVICE_NAME!,
      },
      to: [
        {
          email: env.TEST_EMAIL!,
        },
      ],
      subject: "Confirm Your Email Address",
      message: `Welcome to ${env.SERVICE_NAME}! We're excited to have you on board.\nTo get started, we need to confirm your email address.\n This ensures that we have the right contact information for you and helps protect your account.\nPlease click the link below to confirm your email address:\n\nhttps://${env.DOMAIN_URL}/verify-email?token=${token}\n\nIf you did not request this email, please ignore it.\nBest regards,\nThe ${env.SERVICE_NAME} Team`,
    };
    const { success } = await emailUtil.sendEmail(inputs);
    return new Response(JSON.stringify({ success }));
  },
};
