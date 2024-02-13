import {
  IEmailUtil,
  SendEmailInputs,
} from "../../application/interfaces/email.util";

export class EmailUtil implements IEmailUtil {
  constructor() {}

  sendEmail = async (inputs: SendEmailInputs) => {
    let sendRequest = new Request("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: inputs.to }],
        from: inputs.from,
        subject: inputs.subject,
        content: [
          {
            type: "text/plain",
            value: inputs.message,
          },
        ],
      }),
    });

    const resp = await fetch(sendRequest);
    const status = resp.status;
    if (status >= 200 && status < 300) {
      return { success: true };
    }

    return { success: false };
  };
}
