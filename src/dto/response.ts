export class ControllerResponse<T = any> {
  private code: number;
  private payload: {
    success: boolean;
    message: string;
    data?: T;
  };
  constructor({
    code,
    payload,
  }: {
    code: number;
    payload: {
      success: boolean;
      message?: string;
      data?: T;
    };
  }) {
    this.code = code;
    payload.message ??= "";
    this.payload = payload as any;
  }

  getResponse = () => {
    return {
      code: this.code,
      payload: this.payload,
    };
  };
}
