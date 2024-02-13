export type SendEmailInputs = {
  from: {
    email: string;
    name: string;
  };
  to: { email: string }[];
  subject: string;
  message: string;
};

export interface IEmailUtil {
  sendEmail: (inputs: SendEmailInputs) => Promise<{ success: boolean }>;
}
