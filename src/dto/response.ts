export class ControllerResponse<T = any> {
  private code: number;
  private headers: { name: string; value: string }[];
  private payload: {
    success: boolean;
    message: string;
    data?: T;
  };
  constructor({
    code,
    headers,
    payload,
  }: {
    code: number;
    headers?: { name: string; value: string }[];
    payload: {
      success: boolean;
      message?: string;
      data?: T;
    };
  }) {
    this.code = code;
    payload.message ??= "";
    this.payload = payload as any;
    this.headers = headers ? headers : [];
  }

  getResponse = () => {
    return {
      code: this.code,
      payload: this.payload,
      headers: this.headers,
    };
  };
}
