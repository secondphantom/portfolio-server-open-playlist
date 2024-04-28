export class ServerError<T = any> extends Error {
  private code: number;
  private data: any;
  constructor({
    code,
    message,
    data,
  }: {
    code: number;
    message: string;
    data?: T;
  }) {
    super(message);
    this.code = code;
    this.data = data;
  }

  getMessage = () => {
    return {
      code: this.code,
      message: this.message,
      data: this.data,
    };
  };
}
