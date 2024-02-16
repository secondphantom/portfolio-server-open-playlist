import z from "zod";

import { IAuthValidator } from "../../controller/auth/auth.interface";
import { RequestAuthSignUpBody } from "../../requests/auth/auth.requests";
import { ServerError } from "../../dto/error";

export class AuthValidator implements IAuthValidator {
  static instance: AuthValidator | undefined;
  static getInstance = () => {
    if (this.instance) return this.instance;
    this.instance = new AuthValidator();
    return this.instance;
  };

  // Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
  private passwordValidation = new RegExp(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
  );

  private requestAuthSignUpBody = z
    .object({
      email: z
        .string()
        .min(1, { message: "Must have at least 1 character" })
        .email("This is not a valid email."),
      password: z
        .string()
        .min(1, { message: "Must have at least 1 character" })
        .regex(this.passwordValidation, {
          message:
            "Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character",
        }),
      userName: z
        .string()
        .min(1, { message: "Must have at least 1 character" }),
    })
    .strict();

  signUp = (body: RequestAuthSignUpBody) => {
    try {
      const dto = this.requestAuthSignUpBody.parse(body);
      return dto;
    } catch (error) {
      throw new ServerError({
        code: 400,
        message: "Invalid Input",
      });
    }
  };
}
