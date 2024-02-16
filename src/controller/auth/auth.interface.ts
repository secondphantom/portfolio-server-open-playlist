import { ServiceSignUpDto } from "../../application/service/auth.service";
import { RequestAuthSignUpBody } from "../../requests/auth/auth.requests";

export interface IAuthValidator {
  signUp: (body: RequestAuthSignUpBody) => ServiceSignUpDto;
}
