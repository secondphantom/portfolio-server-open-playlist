export class ServerError extends Error {
  private code: number;
  constructor({ code, message }: { code: number; message: string }) {
    super(message);
    this.code = code;
  }

  getMessage = () => {
    return {
      code: this.code,
      message: this.message,
    };
  };
}
